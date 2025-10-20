import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/service/api.service';

// PrimeNG
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// KafkaCorp alias
import { RandomNameService } from '../../core/service/random-name.service';

// Auth state
import { AuthService } from '../../core/service/auth.service';

interface LoginResponse {
  _id: string; email: string; role?: string; display_name?: string | null;
}

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ToastModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(MessageService);
  private readonly alias = inject(RandomNameService);
  private readonly auth = inject(AuthService);

  pending = signal(false);
  errorMsg = signal<string | null>(null);
  okMsg = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    password: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
    }),
  });

  constructor() {
    const verify = this.route.snapshot.queryParamMap.get('verify'); // 'sent' | 'ok'
    const email = this.route.snapshot.queryParamMap.get('email');
    const reset = this.route.snapshot.queryParamMap.get('reset');  // 'ok'

    if (verify === 'sent' && email) {
      this.okMsg.set(`Email de confirmation envoyé à ${email}. Pense à vérifier tes spams ✉️`);
    } else if (verify === 'ok') {
      this.okMsg.set(`Adresse email vérifiée ✅ Vous pouvez vous connecter.`);
    } else if (reset === 'ok') {
      this.okMsg.set(`Mot de passe mis à jour ✅ Vous pouvez vous connecter.`);
    }
  }

  emailError = computed(() => {
    const c = this.form.controls.email;
    if (!c.touched && !c.dirty) return '';
    if (c.hasError('required')) return 'Email requis.';
    if (c.hasError('email')) return 'Format email invalide.';
    if (c.hasError('maxlength')) return 'Email trop long.';
    return '';
  });

  passwordError = computed(() => {
    const c = this.form.controls.password;
    if (!c.touched && !c.dirty) return '';
    if (c.hasError('required')) return 'Mot de passe requis.';
    if (c.hasError('minlength')) return 'Au moins 8 caractères.';
    if (c.hasError('maxlength')) return 'Mot de passe trop long.';
    return '';
  });

  showInvalid(name: 'email' | 'password'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  onSubmit(): void {
    this.errorMsg.set(null);
    this.okMsg.set(null);

    if (this.form.invalid || this.pending()) {
      this.form.markAllAsTouched();
      return;
    }

    this.pending.set(true);
    const payload = {
      email: this.form.value.email!.trim().toLowerCase(),
      password: this.form.value.password!,
    };

    this.api.post<LoginResponse>('/auth/login', payload)
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({
        next: async (user) => {
          // ✅ mets à jour l’état global d’auth: l’UI bascule sans reload
          this.auth.setUser(user);

          // Choix du nom d’affichage — jamais l’email
          const name =
            (user.display_name && user.display_name.trim()) ||
            (localStorage.getItem('jocke:last-display')?.trim() || '') ||
            'Initié de l’Inutile';
          localStorage.setItem('jocke:last-display', name);

          // Alias KafkaCorp (à partir de /names.txt dans public/)
          const alias = await this.alias.generateAlias();

          // Toast KafkaCorp
          this.msg.add({
            severity: 'success',
            summary: 'Connexion validée',
            detail: `Bienvenue, ${name}. À présent, vous êtes ${alias}.`,
            life: 5000,
          });

          // Redirection vers la route d’origine si présente
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const target = returnUrl && returnUrl.trim() ? returnUrl : '/welcome';

          setTimeout(() => this.router.navigateByUrl(target), 400);
        },
        error: (err) => {
          const detail = err?.error?.error ?? 'Accès REFUSÉ. Savez-vous encore qui vous êtes ?';
          this.errorMsg.set(detail);
          this.msg.add({
            severity: 'error',
            summary: 'Échec de connexion',
            detail,
            life: 3500,
          });
        },
      });
  }
}

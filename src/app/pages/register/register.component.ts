import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/service/api.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

function match(otherControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent as any;
    if (!parent) return null;
    const other = parent.controls?.[otherControlName];
    if (!other) return null;
    return control.value === other.value ? null : { mismatch: true };
  };
}

interface RegisterResponse { _id: string; email: string; role?: string; display_name?: string | null; message?: string; }

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly msg = inject(MessageService);

  pending = signal(false);
  errMsg = signal<string | null>(null);
  readonly roles = ["MasterOfUnivers", "superadmin", "officier", "agent", "visiteur"] as const;

  form = this.fb.nonNullable.group({
    display_name: this.fb.control<string>('', { nonNullable: true }),
    email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(254)] }),
    password: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128)] }),
    confirm: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, match('password')] }),
    role: this.fb.control<typeof this.roles[number]>('visiteur', { nonNullable: true }),
  });

  constructor() {
    this.form.controls.password.valueChanges.subscribe(() => {
      this.form.controls.confirm.updateValueAndValidity({ onlySelf: true });
    });
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
  showConfirmMismatch(): boolean {
    const c = this.form.controls.confirm;
    return !!c.errors?.['mismatch'] && (c.touched || c.dirty);
  }
  showInvalid(name: 'email' | 'password'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  onSubmit(): void {
    this.errMsg.set(null);
    if (this.form.invalid || this.pending()) { this.form.markAllAsTouched(); return; }

    this.pending.set(true);
    const payload = {
      email: this.form.value.email!.trim().toLowerCase(),
      password: this.form.value.password!,
      role: this.form.value.role!,
      display_name: this.form.value.display_name?.trim() || undefined,
    };

    this.api.post<RegisterResponse>('/auth/register', payload)
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({
        next: () => {
          localStorage.setItem('jocke:last-email', payload.email);
          this.msg.add({
            severity: 'info',
            summary: 'Dossier créé',
            detail: 'Une missive initiatique a été expédiée. Suivez le lien et embrassez votre destinée.',
            life: 5000,
          });
          this.router.navigate(['/login'], { queryParams: { verify: 'sent', email: payload.email } });
        },
        error: (err) => {
          const code = err?.status;
          if (code === 409) {
            this.msg.add({
              severity: 'warn',
              summary: 'Matricule existant',
              detail: `Cette adresse mail est déjà répertoriée dans nos archives… ou jadis fut celle d’un membre qui a choisi de nous quitter. La désinscription est irrévocable.`,
              life: 6000,
            });
          } else if (code === 400) {
            this.msg.add({
              severity: 'error',
              summary: 'Données invalides',
              detail: 'Le Département des Inscriptions refuse ce formulaire. Vérifie les champs.',
              life: 5000,
            });
          } else {
            this.msg.add({
              severity: 'error',
              summary: 'Incident bureaucratique',
              detail: err?.error?.error ?? 'Le Grand Mécanisme est momentanément indisponible.',
              life: 5000,
            });
          }
        },
      });
  }
}

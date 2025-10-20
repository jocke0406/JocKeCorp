import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/service/api.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    standalone: true,
    selector: 'app-forgot-password',
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
    private readonly fb = inject(FormBuilder);
    private readonly api = inject(ApiService);
    private readonly msg = inject(MessageService);

    pending = signal(false);

    form = this.fb.nonNullable.group({
        email: this.fb.nonNullable.control('', {
            validators: [Validators.required, Validators.email, Validators.maxLength(254)],
        }),
    });

    emailError = computed(() => {
        const c = this.form.controls.email;
        if (!c.touched && !c.dirty) return '';
        if (c.hasError('required')) return 'Email requis.';
        if (c.hasError('email')) return 'Format email invalide.';
        if (c.hasError('maxlength')) return 'Email trop long.';
        return '';
    });

    showInvalid(): boolean {
        const c = this.form.controls.email;
        return c.invalid && (c.touched || c.dirty);
    }

    onSubmit(): void {
        if (this.form.invalid || this.pending()) { this.form.markAllAsTouched(); return; }

        this.pending.set(true);
        const body = { email: this.form.value.email!.trim().toLowerCase() };

        this.api.post<{ message: string }>('/auth/forgot-password', body)
            .pipe(finalize(() => this.pending.set(false)))
            .subscribe({
                next: () => {
                    this.msg.add({
                        severity: 'info',
                        summary: 'Procédure enclenchée',
                        detail: 'À quoi sert la mémoire quand on a la réinitialisation ?',
                        life: 5000,
                    });
                },
                error: () => {
                    this.msg.add({
                        severity: 'warn',
                        summary: 'Ajourné',
                        detail: 'Non pas maintenant. Plus tard.',
                        life: 4000,
                    });
                },
            });
    }
}

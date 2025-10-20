import { Component, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { ApiService } from '../../core/service/api.service';

// PrimeNG
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

@Component({
    standalone: true,
    selector: 'app-reset-password',
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly api = inject(ApiService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly msg = inject(MessageService);

    token = signal<string | null>(null);
    pending = signal(false);
    okMsg = signal<string | null>(null);
    errMsg = signal<string | null>(null);

    private sub?: Subscription;

    form = this.fb.nonNullable.group({
        password: this.fb.nonNullable.control('', {
            validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
        }),
        confirm: this.fb.nonNullable.control('', {
            validators: [Validators.required, match('password')],
        }),
    });

    constructor() {
        const t = this.route.snapshot.queryParamMap.get('token');
        this.token.set(t);
        if (!t) {
            const msg = 'Lien invalide : token manquant.';
            this.errMsg.set(msg);
            this.msg.add({ severity: 'error', summary: 'Réinitialisation', detail: msg, life: 5000 });
        }
        // revalider confirm quand password change
        this.sub = this.form.controls.password.valueChanges.subscribe(() =>
            this.form.controls.confirm.updateValueAndValidity({ onlySelf: true })
        );
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    get showConfirmMismatch(): boolean {
        const c = this.form.controls.confirm;
        return !!c.errors?.['mismatch'] && (c.touched || c.dirty);
    }

    onSubmit(): void {
        this.okMsg.set(null);
        this.errMsg.set(null);

        if (this.form.invalid || this.pending()) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.token()) {
            const msg = 'Lien invalide : token manquant.';
            this.errMsg.set(msg);
            this.msg.add({ severity: 'error', summary: 'Réinitialisation', detail: msg, life: 5000 });
            return;
        }

        this.pending.set(true);
        const body = { token: this.token()!, password: this.form.value.password! };

        this.api.post<{ message: string }>('/auth/reset-password', body)
            .pipe(finalize(() => this.pending.set(false)))
            .subscribe({
                next: (r) => {
                    const msg = r?.message ?? 'Mot de passe mis à jour.';
                    this.okMsg.set(msg);

                    // ✨ Toast KafkaCorp
                    this.msg.add({
                        severity: 'success',
                        summary: 'Mot de passe réinitialisé',
                        detail: 'Votre identité temporaire a été recalibrée.',
                        life: 5000,
                    });

                    // Redirection douce vers login avec hint
                    setTimeout(() => this.router.navigate(['/login'], { queryParams: { reset: 'ok' } }), 700);
                },
                error: (err) => {
                    const detail = err?.error?.error ?? 'Impossible de mettre à jour le mot de passe.';
                    this.errMsg.set(detail);
                    this.msg.add({
                        severity: 'error',
                        summary: 'Réinitialisation échouée',
                        detail,
                        life: 5000,
                    });
                },
            });
    }
}

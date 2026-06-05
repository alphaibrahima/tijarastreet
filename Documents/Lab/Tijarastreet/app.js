/* ==========================================================================
   Tijara Street — Scripts (Construction Page)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initForm();
});

/* ─── Countdown ──────────────────────────────────────────────────────────── */
function initCountdown() {
    // ← Changez cette date pour votre date de lancement réelle
    const LAUNCH_DATE = new Date('2026-07-31T00:00:00');

    const els = {
        d: document.getElementById('days'),
        h: document.getElementById('hours'),
        m: document.getElementById('minutes'),
        s: document.getElementById('seconds'),
    };

    if (!els.d) return;

    function tick() {
        const diff = LAUNCH_DATE - Date.now();
        if (diff <= 0) {
            Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
            return;
        }
        const pad = n => String(n).padStart(2, '0');
        els.d.textContent = pad(Math.floor(diff / 86400000));
        els.h.textContent = pad(Math.floor(diff % 86400000 / 3600000));
        els.m.textContent = pad(Math.floor(diff % 3600000 / 60000));
        els.s.textContent = pad(Math.floor(diff % 60000 / 1000));
    }

    tick();
    setInterval(tick, 1000);
}

/* ─── Email Form ─────────────────────────────────────────────────────────── */
function initForm() {
    const form    = document.getElementById('notify-form');
    const input   = document.getElementById('email-input');
    const btn     = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const msg     = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = input.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            show('Adresse e-mail invalide.', 'error');
            return;
        }

        btn.classList.add('loading');
        btnText.textContent = 'Envoi…';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (res.ok) {
                show('✓ Inscription confirmée — à très bientôt !', 'success');
                form.reset();
            } else {
                const data = await res.json().catch(() => ({}));
                const err = data?.errors?.map(e => e.message).join(', ')
                    || "Une erreur est survenue.";
                show(err, 'error');
            }
        } catch {
            show('Connexion impossible. Réessayez.', 'error');
        } finally {
            btn.classList.remove('loading');
            btnText.textContent = 'Me notifier';
        }
    });

    function show(text, type) {
        msg.className = `form__message show ${type}`;
        msg.textContent = text; // textContent — XSS-safe
        if (type === 'success') {
            setTimeout(() => msg.classList.remove('show'), 6000);
        }
    }
}

<script lang="ts">
    let title = '';
    let date = '';
    let time = '';
    let duration = '2';
    let location = '';
    let description = '';
    let type = 'meeting';
    let link = '';
    let imageFile: File | null = null;
    let uploading = false;
    let success = false;
    let error = '';

    const eventTypes = [
        { value: 'meeting', label: 'Réunion' },
        { value: 'action', label: 'Action' },
        { value: 'workshop', label: 'Atelier' },
        { value: 'institutional', label: 'Institutionnel' }
    ];

    async function submitForm() {
        error = '';
        success = false;
        if (!title || !date || !time || !location || !description) {
            error = "Tous les champs obligatoires doivent être remplis.";
            return;
        }
        
        uploading = true;
        const formData = new FormData();
        formData.append('title', title);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('duration', duration);
        formData.append('location', location);
        formData.append('description', description);
        formData.append('type', type);
        if (link) formData.append('link', link);
        if (imageFile) formData.append('image', imageFile);

        const res = await fetch('/api/events', {
            method: 'POST',
            body: formData
        });

        uploading = false;
        if (res.ok) {
            success = true;
            // Reset form
            title = '';
            date = '';
            time = '';
            duration = '2';
            location = '';
            description = '';
            type = 'meeting';
            link = '';
            imageFile = null;
            (document.getElementById('image-input') as HTMLInputElement).value = '';
            // Reload page to show new event
            setTimeout(() => window.location.reload(), 1500);
        } else {
            const data = await res.json();
            error = data.error || "Erreur lors de l'envoi.";
        }
    }
</script>

<section class="add-event-section">
    <h2 class="discover-title">Ajouter un événement</h2>
    <form class="event-form" on:submit|preventDefault={submitForm} autocomplete="off">
        <div class="form-row">
            <div class="form-group">
                <label for="title">Titre *</label>
                <input id="title" type="text" bind:value={title} required placeholder="Titre de l'événement" />
            </div>
            <div class="form-group">
                <label for="type">Type *</label>
                <select id="type" bind:value={type} required>
                    {#each eventTypes as eventType}
                        <option value={eventType.value}>{eventType.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="date">Date *</label>
                <input id="date" type="date" bind:value={date} required />
            </div>
            <div class="form-group">
                <label for="time">Heure *</label>
                <input id="time" type="time" bind:value={time} required />
            </div>
            <div class="form-group">
                <label for="duration">Durée (heures)</label>
                <select id="duration" bind:value={duration}>
                    <option value="1">1h</option>
                    <option value="2">2h</option>
                    <option value="3">3h</option>
                    <option value="4">4h</option>
                    <option value="6">6h</option>
                    <option value="8">8h</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="location">Lieu *</label>
            <input id="location" type="text" bind:value={location} required placeholder="Lieu de l'événement" />
        </div>

        <div class="form-group">
            <label for="description">Description *</label>
            <textarea id="description" bind:value={description} required rows="4" placeholder="Description de l'événement"></textarea>
        </div>

        <div class="form-group">
            <label for="link">Lien externe (optionnel)</label>
            <input id="link" type="url" bind:value={link} placeholder="https://..." />
        </div>

        <div class="form-group">
            <label for="image-input">Image (optionnel)</label>
            <input id="image-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" on:change={(e:any)=>{ imageFile = e.currentTarget.files?.[0] || null; }} />
        </div>

        <button type="submit" class="hero-cta" disabled={uploading}>
            {uploading ? "Envoi en cours..." : "Ajouter l'événement"}
        </button>

        {#if error}
            <div class="form-error">{error}</div>
        {/if}
        {#if success}
            <div class="form-success">Événement ajouté avec succès !</div>
        {/if}
    </form>
</section>

<style>
    .add-event-section {
        max-width: 800px;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    .event-form {
        background: var(--blanc);
        border-radius: 1.2rem;
        box-shadow: 0 2px 16px rgba(30,30,30,0.07);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        border: 1px solid rgba(230, 242, 238, 0.5);
    }

    .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .event-form label {
        font-family: 'Roboto Condensed', Arial, sans-serif;
        font-weight: bold;
        color: var(--rouge-ouvrier, #c41e3a);
        margin-bottom: 0.2rem;
    }

    .event-form input[type="text"],
    .event-form input[type="date"],
    .event-form input[type="time"],
    .event-form input[type="url"],
    .event-form select,
    .event-form textarea,
    .event-form input[type="file"] {
        font-family: 'Lora', serif;
        font-size: 1rem;
        padding: 0.6rem;
        border: 1.5px solid var(--gris-acier, #6c757d);
        border-radius: 0.5rem;
        background: #fff;
        color: var(--noir-charbon, #1a1a1a);
    }

    .event-form input[type="file"] {
        padding: 0.3rem;
    }

    .hero-cta {
        margin-top: 1rem;
        align-self: flex-start;
    }

    .form-error {
        color: #c41e3a;
        font-weight: bold;
        margin-top: 0.5rem;
        padding: 0.8rem;
        background: rgba(196, 30, 58, 0.1);
        border-radius: 0.5rem;
        border-left: 4px solid #c41e3a;
    }

    .form-success {
        color: #0B3D2E;
        font-weight: bold;
        margin-top: 0.5rem;
        padding: 0.8rem;
        background: rgba(11, 61, 46, 0.1);
        border-radius: 0.5rem;
        border-left: 4px solid #0B3D2E;
    }

    @media (max-width: 768px) {
        .add-event-section {
            padding: 0 1rem;
        }
        .event-form {
            padding: 1.5rem;
        }
        .form-row {
            grid-template-columns: 1fr;
        }
        .event-form input[type="text"],
        .event-form input[type="date"],
        .event-form input[type="time"],
        .event-form input[type="url"],
        .event-form select,
        .event-form textarea {
            font-size: 16px; /* Prevents zoom on iOS */
        }
    }
</style>

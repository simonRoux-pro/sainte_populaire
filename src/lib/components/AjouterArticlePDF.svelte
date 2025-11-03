<script lang="ts">
    let title = '';
    let date = '';
    let summary = '';
    let pdfFile: File | null = null;
    let uploading = false;
    let success = false;
    let error = '';
    let imageFile: File | null = null;
    let link = '';

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input && input.files && input.files.length > 0) {
            pdfFile = input.files[0];
        } else {
            pdfFile = null;
        }
    }

    async function submitForm() {
        error = '';
        success = false;
        if (!title || !date || !summary || !pdfFile) {
            error = "Tous les champs sont obligatoires.";
            return;
        }
        uploading = true;
        const formData = new FormData();
        formData.append('title', title);
        formData.append('date', date);
        formData.append('summary', summary);
        formData.append('pdf', pdfFile);
        if (imageFile) formData.append('image', imageFile);
        formData.append('link', link);

        const res = await fetch('/api/upload-pdf', {
            method: 'POST',
            body: formData
        });

        uploading = false;
        if (res.ok) {
            success = true;
            title = '';
            date = '';
            summary = '';
            imageFile = null;
            link = '';
            pdfFile = null;
            (document.getElementById('pdf-input') as HTMLInputElement).value = '';
            const imgInput = document.getElementById('image-input') as HTMLInputElement;
            if (imgInput) imgInput.value = '';
        } else {
            const data = await res.json();
            error = data.error || "Erreur lors de l'envoi.";
        }
    }
</script>

<section class="actualites-section">
    <h2 class="discover-title">Ajouter un article PDF</h2>
    <form class="pdf-form" on:submit|preventDefault={submitForm} autocomplete="off">
        <div class="form-group">
            <label for="title">Titre</label>
            <input id="title" type="text" bind:value={title} required placeholder="Titre du PDF" />
        </div>
        <div class="form-group">
            <label for="date">Date</label>
            <input id="date" type="date" bind:value={date} required />
        </div>
        <div class="form-group">
            <label for="summary">Résumé</label>
            <textarea id="summary" bind:value={summary} required rows="3" placeholder="Résumé court"></textarea>
        </div>
        <div class="form-group">
            <label for="pdf-input">Fichier PDF</label>
            <input id="pdf-input" type="file" accept="application/pdf" on:change={handleFileChange} required />
        </div>
        <div class="form-group">
            <label for="image-input">Image (optionnel)</label>
            <input id="image-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" on:change={(e:any)=>{ imageFile = e.currentTarget.files?.[0] || null; }} />
        </div>
<div class="form-group">
    <label for="link">Lien externe</label>
    <input id="link" type="text" bind:value={link} placeholder="Lien externe (optionnel)" />
</div>
        <button type="submit" class="hero-cta" disabled={uploading}>
            {uploading ? "Envoi en cours..." : "Ajouter l'article PDF"}
        </button>
        {#if error}
            <div class="form-error">{error}</div>
        {/if}
        {#if success}
            <div class="form-success">Article PDF ajouté avec succès !</div>
        {/if}
    </form>
</section>

<style>
.pdf-form {
    max-width: 420px;
    margin: 2rem auto;
    background: var(--blanc);
    border-radius: 1.2rem;
    box-shadow: 0 2px 16px rgba(30,30,30,0.07);
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    border: 1px solid rgba(230, 242, 238, 0.5);
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.pdf-form label {
    font-family: 'Roboto Condensed', Arial, sans-serif;
    font-weight: bold;
    color: var(--rouge-ouvrier, #c41e3a);
    margin-bottom: 0.2rem;
}
.pdf-form input[type="text"],
.pdf-form input[type="date"],
.pdf-form textarea,
.pdf-form input[type="file"] {
    font-family: 'Lora', serif;
    font-size: 1rem;
    padding: 0.5rem;
    border: 1.5px solid var(--gris-acier, #6c757d);
    border-radius: 0.5rem;
    background: #fff;
    color: var(--noir-charbon, #1a1a1a);
}
.pdf-form input[type="file"] {
    padding: 0.2rem;
}
.hero-cta {
    margin-top: 1rem;
}
.form-error {
    color: #c41e3a;
    font-weight: bold;
    margin-top: 0.5rem;
}
.form-success {
    color: #0B3D2E;
    font-weight: bold;
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    .pdf-form {
        margin: 1rem auto;
        padding: 1.5rem 1rem;
    }
    .pdf-form input[type="text"],
    .pdf-form input[type="date"],
    .pdf-form textarea,
    .pdf-form input[type="file"] {
        font-size: 16px; /* Prevents zoom on iOS */
    }
}
</style>
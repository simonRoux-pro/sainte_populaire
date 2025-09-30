<script lang="ts">
    import Hero from '$lib/components/Hero.svelte';
    import AjouterEvenement from '$lib/components/AjouterEvenement.svelte';
    import { onMount } from 'svelte';
    
    interface Event {
        id: number;
        title: string;
        date: string;
        time: string;
        duration: string;
        location: string;
        description: string;
        type: string;
        link?: string;
        image?: string;
        createdAt?: string;
    }
    
    let events: Event[] = [];
    let isAdmin = false;
    let showAddForm = false;

    onMount(async () => {
        // Check admin status
        const adminRes = await fetch('/api/login', { method: 'GET' });
        isAdmin = adminRes.ok;
        
        // Load events
        await loadEvents();
    });

    async function loadEvents() {
        try {
            const res = await fetch('/api/events');
            if (res.ok) {
                events = await res.json();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des événements:', error);
        }
    }

    async function deleteEvent(eventId: number) {
        if (!confirm("Supprimer cet événement ?")) return;
        
        try {
            const res = await fetch('/api/events', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId })
            });
            
            if (res.ok) {
                await loadEvents(); // Reload events
            } else {
                alert("Erreur lors de la suppression.");
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors de la suppression.");
        }
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    function getEventTypeColor(type: string) {
        const colors: Record<string, string> = {
            meeting: '#c41e3a',
            action: '#25D366',
            workshop: '#1877F3',
            institutional: '#6c757d'
        };
        return colors[type] || '#c41e3a';
    }

    function getEventTypeLabel(type: string) {
        const labels: Record<string, string> = {
            meeting: 'Réunion',
            action: 'Action',
            workshop: 'Atelier',
            institutional: 'Institutionnel'
        };
        return labels[type] || 'Événement';
    }

    function createGoogleCalendarLink(event: Event) {
        const startDate = new Date(`${event.date}T${event.time}:00`);
        const endDate = new Date(startDate.getTime() + (parseInt(event.duration) * 60 * 60 * 1000));
        
        const formatDateForGoogle = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title,
            dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
            details: event.description,
            location: event.location
        });

        return `https://www.google.com/calendar/render?${params.toString()}`;
    }

    function createOutlookLink(event: Event) {
        const startDate = new Date(`${event.date}T${event.time}:00`);
        const endDate = new Date(startDate.getTime() + (parseInt(event.duration) * 60 * 60 * 1000));
        
        const formatDateForOutlook = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const params = new URLSearchParams({
            path: '/calendar/action/compose',
            rru: 'addevent',
            subject: event.title,
            startdt: formatDateForOutlook(startDate),
            enddt: formatDateForOutlook(endDate),
            body: `${event.description}\n\nLieu: ${event.location}`,
            location: event.location
        });

        return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
    }

    function createICSFile(event: Event) {
        const startDate = new Date(`${event.date}T${event.time}:00`);
        const endDate = new Date(startDate.getTime() + (parseInt(event.duration) * 60 * 60 * 1000));
        
        const formatDateForICS = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sainte Populaire//Event//FR
BEGIN:VEVENT
UID:${event.id}@saintepopulaire.fr
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        return url;
    }
</script>

<Hero />

<section class="calendar-section">
    <div class="calendar-container">
        <h2 class="discover-title">Calendrier des événements</h2>
        <p class="calendar-subtitle">Découvrez nos prochaines actions et rejoignez-nous !</p>
        
        {#if isAdmin}
            <div class="admin-controls">
                <button class="hero-cta" on:click={() => showAddForm = !showAddForm}>
                    {showAddForm ? 'Annuler' : 'Ajouter un événement'}
                </button>
            </div>
            
            {#if showAddForm}
                <AjouterEvenement />
            {/if}
        {/if}
        
        <div class="events-grid">
            {#each events as event}
                <div class="event-card">
                    <div class="event-header">
                        <div class="event-type" style="background-color: {getEventTypeColor(event.type)}">
                            {getEventTypeLabel(event.type)}
                        </div>
                        <div class="event-date">
                            {formatDate(event.date)}
                        </div>
                    </div>
                    
                    <h3 class="event-title">{event.title}</h3>
                    
                    {#if event.image}
                        <div class="event-image">
                            <img src={event.image} alt={event.title} />
                        </div>
                    {/if}
                    
                    <div class="event-details">
                        <div class="event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12,6 12,12 16,14"/>
                            </svg>
                            <span>{event.time} ({event.duration}h)</span>
                        </div>
                        <div class="event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>{event.location}</span>
                        </div>
                    </div>
                    
                    <p class="event-description">{event.description}</p>
                    
                    {#if event.link}
                        <div class="event-link">
                            <a href={event.link} target="_blank" rel="noopener" class="external-link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                    <polyline points="15,3 21,3 21,9"/>
                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                                En savoir plus
                            </a>
                        </div>
                    {/if}
                    
                    <div class="event-actions">
                        <a href={createGoogleCalendarLink(event)} target="_blank" rel="noopener" class="calendar-btn google">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Google
                        </a>
                        <a href={createOutlookLink(event)} target="_blank" rel="noopener" class="calendar-btn outlook">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Outlook
                        </a>
                        <a href={createICSFile(event)} download="{event.title}.ics" class="calendar-btn apple">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Apple
                        </a>
                        
                        {#if isAdmin}
                            <button class="delete-btn" title="Supprimer l'événement" aria-label="Supprimer l'événement" on:click={() => deleteEvent(event.id)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6"/>
                                    <path d="M14 11v6"/>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                            </button>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        
        <div class="calendar-footer">
            <p>Pour plus d'informations, consultez notre <a href="https://app.agorakit.org/groups/3288/actions" target="_blank" rel="noopener">agenda complet sur Agorakit</a>.</p>
        </div>
    </div>
</section>

<style>
    .calendar-section {
        max-width: 1200px;
        margin: 3rem auto;
        padding: 0 1.5rem;
    }

    .calendar-container {
        text-align: center;
    }

    .calendar-subtitle {
        color: var(--noir-charbon, #1a1a1a);
        font-size: 1.1rem;
        margin: 1rem 0 2rem 0;
        opacity: 0.8;
    }

    .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .event-card {
        background: var(--blanc);
        border-radius: 1.2rem;
        padding: 2rem;
        box-shadow: 0 2px 16px rgba(30,30,30,0.07);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        text-align: left;
        border: 1px solid rgba(230, 242, 238, 0.5);
    }

    .event-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 24px rgba(30,30,30,0.12);
    }

    .event-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .event-type {
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .event-date {
        color: var(--rouge-ouvrier, #c41e3a);
        font-weight: 600;
        font-size: 0.9rem;
    }

    .event-title {
        font-family: 'Roboto Condensed', Arial, sans-serif;
        font-weight: bold;
        color: var(--rouge-ouvrier, #c41e3a);
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
    }

    .event-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .event-detail {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--noir-charbon, #1a1a1a);
        font-size: 0.9rem;
    }

    .event-detail svg {
        color: var(--rouge-ouvrier, #c41e3a);
        flex-shrink: 0;
    }

    .event-description {
        color: var(--noir-charbon, #1a1a1a);
        line-height: 1.5;
        margin-bottom: 1.5rem;
    }

    .event-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .calendar-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.8rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s ease;
        border: 1px solid transparent;
    }

    .calendar-btn.google {
        background: #4285f4;
        color: white;
    }

    .calendar-btn.google:hover {
        background: #3367d6;
        transform: translateY(-1px);
    }

    .calendar-btn.outlook {
        background: #0078d4;
        color: white;
    }

    .calendar-btn.outlook:hover {
        background: #106ebe;
        transform: translateY(-1px);
    }

    .calendar-btn.apple {
        background: #000;
        color: white;
    }

    .calendar-btn.apple:hover {
        background: #333;
        transform: translateY(-1px);
    }

    .calendar-footer {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(30,30,30,0.1);
    }

    .calendar-footer a {
        color: var(--rouge-ouvrier, #c41e3a);
        text-decoration: none;
        font-weight: 500;
    }

    .calendar-footer a:hover {
        text-decoration: underline;
    }

    .admin-controls {
        margin: 2rem 0;
    }

    .event-image {
        margin: 1rem 0;
        border-radius: 0.8rem;
        overflow: hidden;
    }

    .event-image img {
        width: 100%;
        height: auto;
        max-height: 200px;
        object-fit: cover;
    }

    .event-link {
        margin: 1rem 0;
    }

    .external-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--rouge-ouvrier, #c41e3a);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .external-link:hover {
        color: var(--vert-hover, #0B3D2E);
        text-decoration: underline;
    }

    .delete-btn {
        background: transparent;
        border: none;
        color: #c41e3a;
        cursor: pointer;
        padding: 0.4rem;
        border-radius: 0.4rem;
        transition: all 0.2s ease;
        margin-left: auto;
    }

    .delete-btn:hover {
        background: rgba(196, 30, 58, 0.1);
        color: #a3132b;
    }

    @media (max-width: 768px) {
        .events-grid {
            grid-template-columns: 1fr;
        }
        
        .event-actions {
            justify-content: center;
        }
    }
</style>

import type { DevfestPanel, Track } from '@gdg-wroclaw/ui';

/*
 * What each DevFest Wrocław 2026 discussion panel is about, shown beside the host (ADR-0034).
 * Written by the organizers around the panelists' work and the news of 2026 (as of 2026-11-03):
 * Angular 22 with stable Signal Forms (June), the WebMCP origin trial in Chrome (Google I/O),
 * Agent Compute Engine and GKE Agent Sandbox on Google Cloud (October), Android 17, Gemini Nano 4
 * in the AICore developer preview and AppFunctions (I/O), and Genkit Dart 1.0 (October).
 */
export const DEVFEST_PANELS: Readonly<
  Partial<Record<Track, Pick<DevfestPanel, 'description' | 'topics'>>>
> = {
  web: {
    description:
      'Frameworki dogadały się co do sygnałów, przeglądarki uczą się rozmawiać z agentami AI, a coraz więcej kodu frontendu piszą asystenci. Rozmawiamy o tym, jak w 2026 roku budować szybki i dostępny web, który dobrze obsłuży zarówno ludzi, jak i agentów.',
    topics: [
      'Sygnały wszędzie: Angular 22 ze stabilnymi Signal Forms, Vue i Nuxt — co to zmienia w architekturze aplikacji?',
      'Agent-ready web: WebMCP w Chrome i strony, które udostępniają agentom swoje akcje.',
      'Wydajność w praktyce: Core Web Vitals, Baseline i realne budżety na urządzeniach użytkowników.',
      'Asystenci kodu we frontendzie: gdzie przyspieszają, a gdzie psują dostępność i jakość?',
    ],
  },
  cloud: {
    description:
      'Agenci AI przestali być demem i trafiają na produkcję, a chmura dostosowuje się do nich: izolowane środowiska wykonawcze, nowe modele uprawnień i rachunki liczone w tokenach. Rozmawiamy o tym, jak bezpiecznie i rozsądnym kosztem uruchamiać agentów i serwery MCP w Google Cloud.',
    topics: [
      'Gdzie uruchomić agenta: Cloud Run, GKE Agent Sandbox czy nowy Agent Compute Engine z microVM dla każdego agenta?',
      'Tożsamość i uprawnienia agentów: IAM, najmniejsze uprawnienia i audyt tego, co agent zrobił.',
      'Serwery MCP w firmie: jak udostępnić agentom dane i narzędzia bez otwierania wszystkiego.',
      'FinOps dla AI: koszty GPU, tokenów i skalowania do zera — oraz lokalizacja danych w UE.',
    ],
  },
  mobile: {
    description:
      'Telefon staje się miejscem, w którym działa model, a aplikacja — narzędziem dla asystenta. Rozmawiamy o AI na urządzeniu, o tym, jak aplikacje udostępniają swoje funkcje agentom, i o tym, który stos wieloplatformowy wybrać w 2026 roku.',
    topics: [
      'AI na urządzeniu: Gemini Nano 4 w AICore, prywatność i działanie offline kontra modele w chmurze.',
      'Aplikacja jako narzędzie agenta: AppFunctions w Androidzie 17 i interfejsy głosowe.',
      'Flutter czy Kotlin i Compose Multiplatform? Doświadczenia zespołów, które wybrały jedno lub drugie.',
      'Genkit Dart 1.0 i Firebase: funkcje AI w aplikacjach Flutter od prototypu do produkcji.',
    ],
  },
  ai: {
    description:
      'Zbudowanie agenta zajmuje dziś popołudnie; sprawienie, by działał niezawodnie, zajmuje miesiące. Rozmawiamy o tym, jak agenci zmieniają pracę zespołów programistycznych, jak mierzyć ich jakość i jak łączyć ich ze światem przez otwarte protokoły.',
    topics: [
      'Agentic engineering: zespoły, w których agenci prototypują, testują i otwierają pull requesty — co zostaje dla ludzi?',
      'Ewaluacje i obserwowalność: skąd wiadomo, że kolejna zmiana promptu lub modelu naprawdę pomogła?',
      'MCP, A2A i WebMCP: otwarte protokoły łączące agentów z narzędziami, innymi agentami i stronami WWW.',
      'Wybór modelu i koszty, a także co AI Act oznacza dla zespołów budujących AI w Europie.',
    ],
  },
};

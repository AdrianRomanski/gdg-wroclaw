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
      'Frameworks have converged on signals, browsers are learning to talk to AI agents, and more and more frontend code is written by assistants. We talk about how to build a fast, accessible web in 2026 that works well for people and agents alike.',
    topics: [
      'Signals everywhere: Angular 22 with stable Signal Forms, Vue and Nuxt — what does it change in how we architect apps?',
      'The agent-ready web: WebMCP in Chrome and sites that expose their actions to agents.',
      'Performance in practice: Core Web Vitals, Baseline and real budgets on real users’ devices.',
      'Coding assistants on the frontend: where they speed us up, and where they hurt accessibility and quality.',
    ],
  },
  cloud: {
    description:
      'AI agents have moved from demos to production, and the cloud is adapting to them: isolated runtimes, new permission models and bills counted in tokens. We talk about running agents and MCP servers on Google Cloud safely and at a sensible cost.',
    topics: [
      'Where to run an agent: Cloud Run, GKE Agent Sandbox or the new Agent Compute Engine with a microVM per agent?',
      'Agent identity and permissions: IAM, least privilege and auditing what an agent actually did.',
      'MCP servers in the company: giving agents data and tools without opening everything up.',
      'FinOps for AI: the cost of GPUs, tokens and scaling to zero — and keeping data in the EU.',
    ],
  },
  mobile: {
    description:
      'The phone is becoming a place where models run, and the app is becoming a tool for the assistant. We talk about on-device AI, how apps expose their features to agents, and which cross-platform stack to choose in 2026.',
    topics: [
      'On-device AI: Gemini Nano 4 in AICore, privacy and working offline versus models in the cloud.',
      'The app as an agent’s tool: AppFunctions in Android 17 and voice interfaces.',
      'Flutter or Kotlin and Compose Multiplatform? Stories from teams that picked one or the other.',
      'Genkit Dart 1.0 and Firebase: AI features in Flutter apps from prototype to production.',
    ],
  },
  ai: {
    description:
      'Building an agent takes an afternoon today; making it reliable takes months. We talk about how agents are changing the way engineering teams work, how to measure their quality, and how to connect them to the world through open protocols.',
    topics: [
      'Agentic engineering: teams where agents prototype, test and open pull requests — what is left for people?',
      'Evaluations and observability: how do you know the next prompt or model change actually helped?',
      'MCP, A2A and WebMCP: open protocols connecting agents to tools, to other agents and to websites.',
      'Choosing models and managing cost, and what the AI Act means for teams building AI in Europe.',
    ],
  },
};

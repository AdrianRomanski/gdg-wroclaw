/*
 * Speaker bios of DevFest Wrocław 2026, one string per paragraph, keyed by the name used in the
 * agenda (ADR-0030). From the speakers' submissions to the organizers (2026-11-02), and for Goran
 * Minov, Muhammad Ahsan Ayaz, Piotr Prus and Tarun Jain from the GDG community
 * event page (https://gdg.community.dev/e/m8h9cm/). Pawel Ostromecki's bio is shortened to the
 * professional parts of his submission.
 */
export const DEVFEST_BIOS: Readonly<Record<string, readonly string[]>> = {
  'Oleksandr Tilnyi': [
    'With over 6 years of experience, Oleksandr brings a strong engineering foundation shaped by working across a variety of projects - from dynamic startups to large mobile systems. He has consistently contributed as a core team member, helping enforce best industry practices and delivering scalable, maintainable code with a strong focus on readability and long-term value.',
    'His background includes a tech lead role for a market-available outdoor hiking app, where technical and business priorities were balanced to guide product development effectively. Oleksandr has a broad perspective on software architecture and development workflows, while maintaining an open-minded, pragmatic approach to problem-solving.',
    'Beyond hands-on development, he’s actively engaged in the tech community as both a speaker and attendee, being committed to knowledge sharing and expansion of T-shaped skill set - particularly in public speaking, mentorship, and cross-functional collaboration.',
  ],
  'Ankur Roy': [
    'I am a Solutions Architect at Online Partner AB. I have worked on several projects involving Google Cloud services and Google Workspace along with multiple other technology stacks and platforms.',
    'I love doing talks, especially workshops.',
  ],
  'Jakub Andrzejewski': [
    'I am an experienced fullstack developer specializing in Vue and Node - specifically Nuxt where I am also a part of the Ecosystem Team. Apart from that, I am a Google Developer Expert in Web Performance and an ambassador for Storyblok, Algolia, Cloudinary, and Supabase.',
    'I am a content creator (articles, videos, open-source projects) with over 1.000.000 views across different channels, and a conference speaker (WeAreDevelopers, Vue.js Live) for audiences of up to 1000 people and Open Source Maintainer with packages reaching over 3.000.000 downloads and more than 1000 GitHub Stars.',
  ],
  'Paweł Kubiak': [
    'Meet Paweł Kubiak — Frontend & AI Tech Lead, speaker, and community enthusiast working at the intersection of modern web development, engineering leadership, and AI.',
    'In his day-to-day work, he leads engineering teams, shapes technical direction and architecture, and explores how AI and agentic workflows can improve the way teams build software and deliver products.',
    'He is particularly passionate about WebAI and WebMCP, experimenting with new ways for AI agents to interact with web applications and exploring what it means to build a web that is not only human-friendly, but also agent-friendly.',
    'Paweł shares his experience and experiments through articles, meetups, and conference talks, covering AI agents, WebMCP, emerging web technologies, and the changing role of software engineering in the AI era.',
    'At DevFest Wrocław, he will join the AI Panel, bringing the perspective of both a technical leader and a hands-on engineer exploring where AI and the web are heading next.',
  ],
  'Tomasz Flis': [
    'As a Lead Frontend Engineer, my focus is on turning complex systems into simple, intuitive, and user-friendly experiences. I balance empathy for the user with technical precision — from architectural design down to the final pixel in the interface.',
    'I have proven experience leading frontend teams, collaborating closely with UX/UI designers, and implementing best practices that elevate both code quality and delivery speed.',
    'Core technologies I work with daily: Angular, React, TypeScript, RxJS, Tailwind CSS, Nx.',
    'I believe that great frontend development isn’t just about how a product looks, but how it makes people feel when they interact with it.',
  ],
  'Artur Wojnar': [
    'I’m a Solutions Architect and consultant with 15 years of experience helping development teams deliver better products. I focus on collaboratively designing solutions with clients—evaluating ideas, assessing risks, and translating them into technical requirements aligned with business goals.',
  ],
  'Elaine Dias Batista': [
    'Elaine has been working with Mobile Apps Development for more than 10 years. Since the launch of the Google Assistant, she has been following the developments around that area. She truly believes that interacting with natural language will define the future of computing.',
    'Born and raised in Brazil, raised again in France, Latina at heart, she loves everything multicultural.',
  ],
  'Pawel Ostromecki': [
    'I’m a senior fullstack engineer and frontend architect with 8+ years of commercial experience. I live in Wrocław, Poland, and work remotely for clients in Western Europe and North America: automotive, RegTech, fintech, e-commerce and airline projects.',
    'Most of my work is frontend architecture in Angular and Nx, with NestJS on the backend. I care about systems that are still easy to change after the product and the team have grown.',
    'I build registry software for a Canadian province, including Form Flex, an internal drag-and-drop configurator for complex forms, and I’m designing its agentic layer: an MCP server that exposes form generation, and an in-app assistant running on a local model.',
    'I’ve been on both sides of microfrontends: I helped roll out Module Federation, and later led the exit from it when it stopped fitting our architecture.',
    'I lead Angular Wrocław: I organize meetups, run workshops and give talks on frontend architecture and performance.',
  ],
  'Tarun Jain': [
    'Founding Engineer, GDE in AI and YouTube Content Creator at AI with Tarun.',
  ],
  'Dominik Šimoník': [
    'I build two things: high-quality Flutter apps and the communities where their developers thrive 💙',
    'As a Technical Delivery Lead, my day job is turning ideas into seamless, high-quality mobile experiences. I live and breathe Flutter.',
    'But the real magic happens when we share what we learn. My passion is helping the tech community grow, which I do as Google Developer Expert for both Firebase & Flutter. A long-time Event Organizer for GUG.cz (8+ years and counting!).',
  ],
  'Çalgan Aygün': [
    'Çalgan Aygün is a DevOps Lead at FinalCheck, specializing in providing solutions for individual verification. Previously, he worked as a backend and cloud engineer at QuarPay, focusing on modernizing infrastructure and developing faster payment systems.',
    'With a background as a software developer at My Security Analytics, his experience extends to analytics software for business, fraud, and government security.',
  ],
  'Goran Minov': [
    'Goran is a Google Developer Expert (GDE) in Google Cloud (Cloud AI), Cloud AI and Cyber Security Architect.',
    'Currently, he serves as a Senior Technical Account Manager at Okta, helping enterprises automate and secure their identity infrastructure. His passion lies in architecting secure machine learning workflows, deploying autonomous applications via the Gemini Enterprise Agent Platform, and ensuring that multi-agent systems are governed by strict Secure-by-Design and Zero Trust principles.',
    'A passionate community leader, Goran has been an Organiser for GDG London since 2019, helping grow one of the largest developer communities in the UK. He is also the Founder of The Cloud Circuit, an independent event series connecting London’s practitioners with advanced cloud and AI deployment strategies, and a Co-founder of The Android Circuit.',
    'As a prominent speaker and technical mentor, Goran regularly shares his expertise in securing Agentic AI and implementing Zero Trust Architecture. He has delivered workshops and talks at major venues including Droidcon London and DevFest.',
  ],
  'Muhammad Ahsan Ayaz': [
    'Muhammad Ahsan Ayaz is a Google Developer Expert (GDE) in Angular and a seasoned Software Architect. He is a passionate open-source contributor, best known as the creator of the popular ngx-device-detector library and author of the "Angular Cookbook." Through his "Code with Ahsan" community, he shares his expertise in modern web development, AI, and productivity with thousands of developers worldwide.',
  ],
  'Piotr Prus': [
    'Piotr Prus is a self-taught Android developer who excels at tackling UI and architectural challenges. He’s passionate about pushing the boundaries of mobile development, currently focusing on Jetpack Compose and Kotlin Multiplatform Mobile.',
    'A speaker at tech conferences and an author of insightful articles, Piotr is eager to share his knowledge and connect with fellow developers. He believes in the power of collaboration and makes complex topics easy to understand.',
  ],
};

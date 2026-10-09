import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Person } from '../person/person';
import { WorkshopDetails } from './workshop-details';

@Component({
  imports: [WorkshopDetails],
  template: `
    <gdg-workshop-details
      topic="Angular Signals in practice"
      description="Bring a laptop."
      [trainers]="trainers()"
    />
  `,
})
class Host {
  readonly trainers = signal<Person[]>([
    { name: 'Ada Lovelace', role: 'speaker' },
    { name: 'Grace Hopper', role: 'organizer' },
  ]);
}

describe('WorkshopDetails', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('renders the topic as the page heading, the description and one row per trainer', async () => {
    const { element } = await setup();
    expect(element.querySelector('h1')?.textContent).toBe(
      'Angular Signals in practice',
    );
    expect(element.querySelector('.description')?.textContent).toBe(
      'Bring a laptop.',
    );
    const section = element.querySelector('section') as HTMLElement;
    const heading = section.querySelector('h2') as HTMLElement;
    expect(heading.textContent?.trim()).toBe('Trainers');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(
      Array.from(element.querySelectorAll('gdg-person-row h3')).map(
        (name) => name.textContent,
      ),
    ).toEqual(['Ada Lovelace', 'Grace Hopper']);
  });

  it('leaves out the trainers section when there are none', async () => {
    const { fixture, element } = await setup();
    fixture.componentInstance.trainers.set([]);
    await fixture.whenStable();
    expect(element.querySelector('section')).toBeNull();
  });
});

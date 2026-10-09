import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type PersonRole, RoleBadge } from './role-badge';

@Component({
  imports: [RoleBadge],
  template: `
    <gdg-role-badge [role]="role()" [ring]="ring()" [label]="label()" />
    <gdg-role-badge role="member" [size]="96" />
  `,
})
class Host {
  readonly role = signal<PersonRole>('speaker');
  readonly ring = signal(true);
  readonly label = signal<string | undefined>(undefined);
}

describe('RoleBadge', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const [badge, member] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        'gdg-role-badge',
      ),
    );
    return { fixture, host: fixture.componentInstance, badge, member };
  }

  it('is an image named after the role', async () => {
    const { fixture, host, badge } = await setup();
    expect(badge.getAttribute('role')).toBe('img');
    expect(badge.getAttribute('aria-label')).toBe('Speaker');

    host.role.set('organizer');
    await fixture.whenStable();
    expect(badge.getAttribute('aria-label')).toBe('Organizer');

    host.label.set('Organizatorka');
    await fixture.whenStable();
    expect(badge.getAttribute('aria-label')).toBe('Organizatorka');
  });

  it('draws the ring only when asked', async () => {
    const { fixture, host, badge } = await setup();
    expect(badge.querySelector('.ring')).not.toBeNull();

    host.ring.set(false);
    await fixture.whenStable();
    expect(badge.querySelector('.ring')).toBeNull();
    expect(badge.querySelector('.disc')).not.toBeNull();
  });

  it('gives every badge its own clip path and sizes it in rem', async () => {
    const { badge, member } = await setup();
    const clipIds = [badge, member].map(
      (element) => element.querySelector('clipPath')?.id,
    );
    expect(clipIds[0]).toBeTruthy();
    expect(clipIds[0]).not.toBe(clipIds[1]);
    expect(member.innerHTML).toContain(`url(#${clipIds[1]})`);
    expect(member.style.getPropertyValue('--gdg-role-badge-size')).toBe('6rem');
  });
});

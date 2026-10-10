import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, type IconName } from '@gdg-wroclaw/design-system-components';
import type { SocialLink, SocialNetwork } from '../person/person';

const NETWORKS: Record<SocialNetwork, { icon: IconName; label: string }> = {
  linkedin: { icon: 'linkedin-logo', label: 'LinkedIn' },
  x: { icon: 'x-logo', label: 'X' },
  github: { icon: 'github-logo', label: 'GitHub' },
  dribbble: { icon: 'dribbble-logo', label: 'Dribbble' },
  facebook: { icon: 'facebook-logo', label: 'Facebook' },
  instagram: { icon: 'instagram-logo', label: 'Instagram' },
  youtube: { icon: 'youtube-logo', label: 'YouTube' },
  website: { icon: 'globe', label: 'website' },
};

/**
 * Social icon links from the Figma Workshop and Team pages (`Social Icons`), see ADR-0016.
 * Each link is named after its owner and network ("Ada Lovelace on LinkedIn") and opens in a
 * new tab.
 */
@Component({
  selector: 'gdg-social-links',
  imports: [Icon],
  templateUrl: './social-links.html',
  styleUrl: './social-links.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinks {
  readonly links = input.required<readonly SocialLink[]>();

  /** Whose profiles these are, used in the link names. */
  readonly owner = input<string>();

  protected readonly networks = NETWORKS;

  protected linkLabel(network: SocialNetwork): string {
    const { label } = NETWORKS[network];
    const owner = this.owner();
    if (network === 'website') {
      return owner ? `${owner}'s website` : 'Website';
    }
    return owner ? `${owner} on ${label}` : label;
  }
}

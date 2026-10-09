import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ContactForm } from './contact-form';

const meta: Meta<ContactForm> = {
  title: 'UI/Contact Form',
  component: ContactForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Contact section from the Figma **Contact Form** page (`Contact / 3 /`). It validates the fields and emits `submitted` with `{ name, email, message }`; the consumer sends the message, sets `pending` meanwhile and calls `reset()` afterwards (ADR-0013, ADR-0014).',
      },
    },
  },
  args: {
    heading: 'Contact us',
    description:
      'Questions about our events, speaking or partnering with GDG Wrocław? Write to us.',
    termsUrl: '#',
    submitLabel: 'Submit',
    pending: false,
    submitted: fn(),
  },
};
export default meta;

type Story = StoryObj<ContactForm>;

export const Default: Story = {};

export const Pending: Story = {
  args: { pending: true },
};

/** Submitting an empty form shows every error and focuses the first field. */
export const ValidationErrors: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveFocus();
    await expect(canvas.getByText('Enter your email.')).toBeVisible();
    await expect(args.submitted).not.toHaveBeenCalled();
  },
};

export const Submitted: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Name' }),
      'Ada Lovelace',
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Email' }),
      'ada@example.com',
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Message' }),
      'See you at DevFest!',
    );
    await userEvent.click(canvas.getByRole('checkbox'));
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    // Under parallel smoke-test load the emit can land after the click resolves.
    await waitFor(() =>
      expect(args.submitted).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'See you at DevFest!',
      }),
    );
  },
};

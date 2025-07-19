import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Header from '../components/header/Header'; // Adjust the import path as necessary

const messages = {
  menu: [
    { name: 'Home', link: 'home' },
    { name: 'About', link: 'about' },
    { name: 'Portfolio', link: 'portfolio' },
    { name: 'Contact', link: 'contact' },
  ],
};

describe('Header', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>
    );

    expect(getByText('Home')).toBeInTheDocument();
  });
});

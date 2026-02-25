import { ThemeProvider } from './components/ThemeProvider';
import { AppRouter } from './lib/router';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="truthlens-theme">
      <AppRouter />
    </ThemeProvider>
  );
}
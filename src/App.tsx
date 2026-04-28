import { ErrorBoundary } from './shared/ui/ErrorBoundary';
import { DashboardLayout } from './features/live-dashboard/components/DashboardLayout';

function App() {
  return (
    <ErrorBoundary>
      <DashboardLayout />
    </ErrorBoundary>
  );
}

export default App;

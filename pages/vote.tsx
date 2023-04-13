import type { NextPage } from 'next';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';

const VotePage: NextPage = () => {
  return (
    <div className="grid grid-cols-1">
      <Vote />
    </div>
  );
}

export default RequireAuth(VotePage);

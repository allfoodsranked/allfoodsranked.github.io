import type { NextPage } from 'next';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';
import Link from 'next/link';

const VotePage: NextPage = () => {
  return (
    <RequireAuth>
      <div>
      <Link href="/">
        Go Home
      </Link>
      <div className="grid grid-cols-1">
        <Vote />
      </div>
      </div>
    </RequireAuth>
  );
}

export default VotePage

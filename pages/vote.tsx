import type { NextPage } from 'next';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../db/client';

const VotePage: NextPage = () => {
  const { query } = useRouter();
  const categoryId = query.category_id as string;
  const { data: categoryDetails } = useQuery(
    ['category', categoryId],
    async () => {
      if (!categoryId) return;
      const resp = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .limit(1);
      return resp;
    }
  );

  const voteQuery = useQuery(['foods', categoryId], async () => {
    let resp;
    if (categoryId) {
      resp = await supabase
        .from('category_foods')
        .select('id:food_id, name')
        .eq('category_id', categoryId);
    } else {
      resp = await supabase.from('foods').select('*');
    }
    return resp;
  });

  return (
    <RequireAuth>
      <div>
        <Link href="/">Go Home</Link>
        <div className="grid grid-cols-1">
          <h1 className="text-center text-5xl">
            {categoryDetails?.data && categoryDetails.data.length > 0
              ? `Which is the best ${categoryDetails?.data[0].name}?`
              : 'Which is better?'}
          </h1>
          <Vote
            foods={voteQuery.data?.data ?? []}
            categoryId={Number(categoryId)}
          />
        </div>
      </div>
    </RequireAuth>
  );
};

export default VotePage;

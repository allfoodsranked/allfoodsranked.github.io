import type { NextPage } from 'next';
import { useSession } from '../auth/auth-context';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../db/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { Ranking } from '../components/ranking';

const Home: NextPage = () => {
  const query = useQuery(['rankings'], async () => {
    const data = await supabase.from('rankings').select('*');
    return data;
  });

  const categoryQuery = useQuery(['category-rankings'], async () => {
    const data = await supabase.from('category_rankings').select('*');

    return data;
  });

  const rankingsByCategory = useMemo(() => {
    if (!categoryQuery.data?.data) return {};

    let grouped: { [key: string]: typeof categoryQuery.data.data } = {};
    categoryQuery.data.data.forEach((ranking) => {
      if (!ranking.category) return;
      const title = `Top ${ranking.category[0]?.toLocaleUpperCase()}${ranking.category.slice(
        1
      )}`;

      if (!grouped[title]) {
        grouped[title] = [];
      }

      grouped[title].push(ranking);
    });

    return grouped;
  }, [categoryQuery]);

  const rankings = query.data?.data ?? [];
  return (
    <>
      <div className="flex justify-between items-center mx-3">
        <h1 className="text-4xl">ALL FOODS RANKED</h1>
        <Link href="/vote">VOTE HERE</Link>
      </div>
      <div className="grid grid-cols-1 text-center">
        <div className="my-4 grid grid-cols-4">
          <Ranking header="Top Ranked Overall" rankings={rankings} />
          {Object.keys(rankingsByCategory).map((title) => (
            <Ranking
              key={title}
              header={title}
              rankings={rankingsByCategory[title]}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

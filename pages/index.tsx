import type { NextPage } from 'next';
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
      </div>
      <div className="grid grid-cols-1 text-center">
        <div className="my-4 grid grid-cols-4">
          <div>
            <Ranking header="Top Ranked Overall" rankings={rankings} />
            <Link href="/vote">Vote</Link>
          </div>
          {Object.keys(rankingsByCategory).map((title) => (
            <div key={title}>
              <Ranking header={title} rankings={rankingsByCategory[title]} />
              <Link
                // todo: less sloppy key lookup
                href={`/vote?category_id=${rankingsByCategory[title][0].category_id}`}
              >
                Vote
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

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

  const { data: categories } = useQuery(['categories'], async () => {
    const data = await supabase.from('categories').select('*');
    return data;
  });

  const categoryQuery = useQuery(['category-rankings'], async () => {
    const data = await supabase.from('category_rankings').select('*');

    return data;
  });

  const categoriesList = categories?.data ?? [];
  const rankingsByCategory = useMemo(() => {
    if (!categoryQuery.data?.data) return {};

    let grouped: { [key: string]: typeof categoryQuery.data.data } = {};
    categoryQuery.data.data.forEach((ranking) => {
      if (!ranking.category_id) return;
      if (!grouped[ranking.category_id]) {
        grouped[ranking.category_id] = [];
      }

      grouped[ranking.category_id].push(ranking);
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
          {categoriesList.map(({ id, name }) => (
            <div key={id}>
              {rankingsByCategory[id] ? (
                <Ranking
                  header={`Top ${name[0]?.toLocaleUpperCase()}${name.slice(1)}`}
                  rankings={rankingsByCategory[id]}
                />
              ) : (
                <p className="my-4">No rankings yet</p>
              )}
              <Link href={`/vote?category_id=${id}`}>Vote {name}</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

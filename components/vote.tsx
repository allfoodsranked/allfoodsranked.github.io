import { useMutation } from '@tanstack/react-query';
import { supabase } from '../db/client';
import { useEffect, useLayoutEffect, useReducer } from 'react';
import { useSession } from '../auth/auth-context';

export const Vote = ({
  foods,
  categoryId,
}: {
  foods: { id: number | null; name: string | null }[];
  categoryId: number;
}) => {
  const session = useSession();
  const { mutateAsync } = useMutation(
    ['send-vote'],
    async (opts: { id: number; value: number }) => {
      await supabase
        .from('votes')
        .insert({
          food_id: opts.id,
          user_id: session?.user.id!,
          value: opts.value,
          category_id: categoryId,
        })
        .select();
    }
  );

  const [randomSeed, regenSeed] = useReducer(
    () => (foods ? Math.round(Math.random() * (foods.length - 1)) : 0),
    0
  );

  useEffect(() => {
    if (foods) {
      regenSeed();
    }
  }, [foods]);

  useLayoutEffect(() => {
    const shortCuts = (e: KeyboardEvent) => {
      if (e.key === '1') {
        handleVote(first.id, second.id);
      }
      if (e.key === '2') {
        handleVote(second.id, first.id);
      }
    };
    const listener = document.addEventListener('keydown', shortCuts);
    return () => document.removeEventListener('keydown', shortCuts);
  });

  const handleVote = (upId: number | null, downId: number | null) => {
    if (!upId) return;
    mutateAsync({ id: upId, value: 1 });
    regenSeed();
  };

  if (!foods) return null;

  const first = foods[randomSeed];
  const second =
    foods[randomSeed + 1 > foods.length ? randomSeed - 1 : randomSeed + 1];

  return (
    <div>
      <div className="grid grid-cols-2 justify-center">
        <button
          className="text-2xl"
          onClick={() => handleVote(first.id, second.id)}
        >
          {first?.name}
        </button>
        <button
          className="text-2xl"
          onClick={() => handleVote(second.id, first.id)}
        >
          {second?.name}
        </button>
      </div>
    </div>
  );
};

import type { NextPage } from 'next';
import { useSession } from '../auth/auth-context';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../db/client';
import Link from 'next/link';
import { ChangeEvent, ChangeEventHandler, useState } from 'react';

const Home: NextPage = () => {
  const foods = useQuery(['foods'], async () => {
    return await supabase.from('foods').select('*');
  });
  const foodList = foods.data?.data ?? [];
  const catQuery = useQuery(['categories'], async () => {
    return await supabase.from('categories').select('*');
  });
  const categories = catQuery.data?.data ?? [];
  const membersQuery = useQuery(['categorymembers'], async () => {
    return await supabase.from('category_foods').select('*');
  });
  const members = membersQuery.data?.data ?? [];
  const [form, setForm] = useState<{ [key: string]: string }>({});
  const selectedCategoryId = form['category'] ?? categories?.[0]?.id;
  const currentMembers = members.filter(
    (m) => m.category === selectedCategoryId
  );
  const [newMembers, setMembers] = useState<number[]>([]);

  const updateForm: ChangeEventHandler = (e) =>
    setForm({ [e.target.name]: e.target.value });
  return (
    <RequireAuth>
      <div className="mx-4 my-6">
        <form
          className="grid grid-cols-1 mx-auto"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const name = form.get('name')?.toString();
            if (name && name.length > 0) {
              e.currentTarget.reset();
              await supabase.from('foods').insert({ name });
            }
          }}
        >
          <h2 className="text-2xl mb-2">Add New Foods for Voting</h2>
          <input type="text" name="name" required />
          <button type="submit">add food</button>
        </form>
        <form
          className="grid grid-cols-1 mx-auto"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const name = form.get('name')?.toString();
            if (name && name.length > 0) {
              e.currentTarget.reset();
              await supabase.from('categories').insert({ name });
            }
          }}
        >
          <h2 className="text-2xl mb-2">Add Categories</h2>
          <input type="text" name="name" required />
          <button type="submit">add category</button>
        </form>
        <h2 className="text-2xl mb-2">Add foods to category</h2>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2 grid grid-cols-1">
            <select
              onChange={updateForm}
              className="h-10"
              name="category"
              value={selectedCategoryId}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {newMembers.length > 0 && (
              <button
                onClick={async () => {
                  await supabase.from('category_tags').insert(
                    newMembers.map((foodId) => ({
                      category_id: Number(selectedCategoryId),
                      food_id: foodId,
                    }))
                  );
                  setMembers([]);
                }}
              >
                Add {newMembers.length} to selected category
              </button>
            )}
          </div>
          <div className="col-span-4">
            <input
              type="text"
              className="w-full"
              name="food-filter"
              placeholder="Search foods"
              onChange={updateForm}
            />
            <ol className="overflow-scroll h-60">
              <li>
                {foodList.map((foodItem) => {
                  if (
                    form['food-filter'] &&
                    !foodItem.name
                      .toLowerCase()
                      .includes(form['food-filter'].toLowerCase())
                  ) {
                    return null;
                  }
                  return (
                    <li key={foodItem.id}>
                      <input
                        type="checkbox"
                        name={foodItem.name}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setMembers((membs) => [
                              ...membs.filter((m) => m !== foodItem.id),
                            ]);
                          } else {
                            setMembers((membs) => [...membs, foodItem.id]);
                          }
                        }}
                        placeholder={foodItem.name}
                        checked={newMembers.includes(foodItem.id)}
                      />
                      <label htmlFor={foodItem.name}>{foodItem.name}</label>
                    </li>
                  );
                })}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Home;

import type { NextPage } from 'next';
import { RequireAuth } from '../auth/with-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../db/client';
import { ChangeEventHandler, useState } from 'react';

const Home: NextPage = () => {
  const foods = useQuery(['foods'], async () => {
    const resp = await supabase.from('foods').select('*');

    return resp;
  });
  const foodList = foods.data?.data ?? [];

  const catQuery = useQuery(['categories'], async () => {
    const resp = await supabase.from('categories').select('*');
    if (resp.error) {
      alert(resp.error.message);
    }
    return resp;
  });
  const categories = catQuery.data?.data ?? [];

  const [form, setForm] = useState<{ [key: string]: string }>({});
  const selectedCategoryId = form['category'] ?? categories?.[0]?.id;
  const membersQuery = useQuery(
    ['category-members', selectedCategoryId],
    async () => {
      if (!selectedCategoryId) return;
      const resp = await supabase
        .from('category_foods')
        .select('food_id')
        .eq('category_id', selectedCategoryId);
      return resp;
    }
  );

  const currentMembers =
    membersQuery.data?.data?.map(({ food_id }) => food_id) ?? [];
  const [newMembers, setMembers] = useState<number[]>([]);

  const updateForm: ChangeEventHandler = (e) =>
    // TODO: fix the type here and be more explicit
    setForm((f) => ({
      ...f,
      [(e.target as any).name]: (e.target as any).value,
    }));

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
              const resp = await supabase.from('foods').insert({ name });
              if (resp.error) {
                alert(resp.error.message);
              }
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
              const resp = await supabase.from('categories').insert({ name });
              if (resp.error) {
                alert(resp.error.message);
              }
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
                  const resp = await supabase.from('category_tags').insert(
                    newMembers.map((foodId) => ({
                      category_id: Number(selectedCategoryId),
                      food_id: foodId,
                    }))
                  );
                  if (resp.error) {
                    alert(resp.error.message);
                  } else {
                    setMembers([]);
                  }
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
                        // todo: support removing from category via UI
                        disabled={currentMembers.includes(foodItem.id)}
                        checked={
                          newMembers.includes(foodItem.id) ||
                          currentMembers.includes(foodItem.id)
                        }
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

import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "../db/client"
import { useEffect, useReducer, useState } from "react"
import { useSession } from "../auth/auth-context"

export const Vote = () => {
  const session = useSession()
  const query = useQuery(['foods'], async () => {
    const d = await supabase.from('foods').select('*').limit(50)
    return d;
  })
  const { mutateAsync } = useMutation(['send-vote'], async (id: number) => {
    console.log(id)
    await supabase.from('votes').insert({ 'food_id': id, user_id: session?.user.id!  }).select()
  })
  
  const foods = query.data?.data
  const [randomSeed, regenSeed] = useReducer(() => foods ? Math.round(Math.random() * foods.length) : 0, 0)

  useEffect(() => {
    if (foods){
      regenSeed()
    }
  }, [foods])

  const handleVote = (id: number) => {
    mutateAsync(id)
    regenSeed()
  }

  if (!foods) return null;

  const first = foods[randomSeed]
  const second = foods[randomSeed + 1]

  return (
    <div>
      <h1 className="text-center text-5xl">
        Which is better?
      </h1>
      <div className="grid grid-cols-2 justify-center">
        <button className="text-2xl" onClick={() => handleVote(first.id)}>
          {first.name}
        </button>
        <button className="text-2xl" onClick={() => handleVote(second.id)}>
          {second.name}
        </button>
      </div>
    </div>
  )


}
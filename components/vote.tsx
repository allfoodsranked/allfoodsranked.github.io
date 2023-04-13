import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "../db/client"
import { useEffect, useLayoutEffect, useReducer, useState } from "react"
import { useSession } from "../auth/auth-context"

export const Vote = () => {
  const session = useSession()
  const query = useQuery(['foods'], async () => {
    const d = await supabase.from('foods').select('*').limit(50)
    return d;
  })
  const { mutateAsync } = useMutation(['send-vote'], async (opts: {id: number, value: number}) => {
    await supabase.from('votes').insert({ 'food_id': opts.id, user_id: session?.user.id!, value: opts.value,}).select()
  })
  
  const foods = query.data?.data
  const [randomSeed, regenSeed] = useReducer(() => foods ? Math.round(Math.random() * (foods.length - 1)) : 0, 0)

  useEffect(() => {
    if (foods){
      regenSeed()
    }
  }, [foods])

  useLayoutEffect(() => {
    const shortCuts = (e: KeyboardEvent) => {
      if (e.key === '1') {
        handleVote(first.id, second.id)
      } 
      if (e.key === '2') {
        handleVote(second.id, first.id)
      }
    }
    const listener = document.addEventListener('keydown', shortCuts)
    return () => document.removeEventListener('keydown', shortCuts)
  })

  const handleVote = (upId: number, downId: number) => {
    mutateAsync({ id: upId, value: 1 })
    regenSeed()
  }

  if (!foods) return null;  

  const first = foods[randomSeed]
  const second = foods[randomSeed + 1 > foods.length ? randomSeed -1 : randomSeed + 1]

  return (
    <div>
      <h1 className="text-center text-5xl">
        Which is better?
      </h1>
      <div className="grid grid-cols-2 justify-center">
        <button className="text-2xl" onClick={() => handleVote(first.id, second.id)}>
          {first.name}
        </button>
        <button className="text-2xl" onClick={() => handleVote(second.id, first.id)}>
          {second.name}
        </button>
      </div>
    </div>
  )


}
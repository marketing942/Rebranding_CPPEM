import "server-only";

const emVoo = new Map<string, Promise<unknown>>();

/**
 * Em build varias paginas pedem a mesma leitura ao mesmo tempo e o cache do
 * Next so guarda o resultado depois que a primeira termina. Aqui as chamadas
 * simultaneas compartilham a mesma promessa; nada fica guardado depois dela.
 */
export function semDuplicar<T>(chave: string, tarefa: () => Promise<T>): Promise<T> {
  const atual = emVoo.get(chave) as Promise<T> | undefined;
  if (atual) return atual;

  const promessa = tarefa().finally(() => emVoo.delete(chave));
  emVoo.set(chave, promessa);
  return promessa;
}

export type HistoricoPesquisasProps = {
  pesquisas: string[];
  onSelecionar: (texto: string) => void;
};

export default function HistoricoPesquisas({
  pesquisas,
  onSelecionar,
}: HistoricoPesquisasProps){
  if (pesquisas.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-2 my-2' aria-label='Histórico de pesquisas'>
      {pesquisas.map((item) => (
        <button key={item} type='button' onClick={() => onSelecionar(item)} className='min-h-[44px] min-w-[44px] px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm focus-visible:outline focus-visible:outline-2'>
          {item}
        </button>
      ))}
    </div>
  );
}
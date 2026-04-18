// Depois, ver de colocar alguma pasta só com os tipos (ex: types/Livro.ts) e importar de lá, pra evitar repetição
type Livro = {
  isbn: string,
  titulo: string,
  autor: string,
  editora: string,
  edicao?: string,
  anoPublicacao: number,
  genero: string,
  unidades: number,
}

type AcervoFormProps = {
  tipo: "adicionar" | "editar";
  livroAtual: Livro;
  setLivroAtual: React.Dispatch<React.SetStateAction<Livro>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function AcervoForm({
    tipo,
    livroAtual,
    setLivroAtual,
    handleSubmit
}: AcervoFormProps) {
    return (
    <form onSubmit={handleSubmit} onChange={(e) => {
        const { name, value } = e.target;
        setLivroAtual((prev) => ({ ...prev, [name]: value }));
    }} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl text-gray-800">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Informações do Livro</h2>
        
        {/* Grid para informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
            
            {/* Título: Ocupa mais espaço */}
            <div className="flex flex-col md:col-span-8">
            <label htmlFor="titulo" className="mb-1 font-medium text-sm">Título do Livro</label>
            <input type="text" name="titulo" id="titulo" defaultValue={livroAtual.titulo} required placeholder="Ex: Dom Casmurro" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            {/* ISBN: Ocupa menos espaço lateral */}
            <div className="flex flex-col md:col-span-4">
            <label htmlFor="isbn" className="mb-1 font-medium text-sm">ISBN</label>
            <input type="text" name="isbn" id="isbn" defaultValue={livroAtual.isbn} required placeholder="978-0-00-000000-0" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Autor */}
            <div className="flex flex-col md:col-span-6">
            <label htmlFor="autor" className="mb-1 font-medium text-sm">Autor</label>
            <input type="text" name="autor" id="autor" defaultValue={livroAtual.autor} required placeholder="Ex: Machado de Assis" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Editora */}
            <div className="flex flex-col md:col-span-6">
            <label htmlFor="editora" className="mb-1 font-medium text-sm">Editora</label>
            <input type="text" name="editora" id="editora" defaultValue={livroAtual.editora} required placeholder="Ex: Companhia das Letras" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Edição */}
            <div className="flex flex-col md:col-span-3">
            <label htmlFor="edicao" className="mb-1 font-medium text-sm">Edição</label>
            <input type="text" name="edicao" id="edicao" defaultValue={livroAtual.edicao} placeholder="Ex: 2ª Edição" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Ano de Publicação */}
            <div className="flex flex-col md:col-span-3">
            <label htmlFor="anoPublicacao" className="mb-1 font-medium text-sm">Ano de Publicação</label>
            <input type="number" name="anoPublicacao" id="anoPublicacao" defaultValue={livroAtual.anoPublicacao} required placeholder="Ex: 1899" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Gênero */}
            <div className="flex flex-col md:col-span-3">
            <label htmlFor="genero" className="mb-1 font-medium text-sm">Gênero</label>
            <input type="text" name="genero" id="genero" defaultValue={livroAtual.genero} placeholder="Ex: Romance" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Unidades */}
            <div className="flex flex-col md:col-span-3">
            <label htmlFor="unidades" className="mb-1 font-medium text-sm">Unidades (Estoque)</label>
            <input type="number" name="unidades" id="unidades" required min="0" defaultValue={livroAtual.unidades}
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>
        </div>

        <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
        >
            {tipo === "adicionar" ? "Adicionar" : "Editar"} Livro
        </button>
    </form>
    );
}
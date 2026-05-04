import AcervoForm from "../components/AcervoForm";


export default function AdicionarAcervoPage() {

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Adicionar Item ao Acervo</h1>
            <AcervoForm tipo="adicionar"/>
        </div>
    );
}
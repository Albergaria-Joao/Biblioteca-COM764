import AcervoForm from "../components/AcervoForm";

export default function EditarAcervoPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Editar livro</h1>
            <AcervoForm tipo="editar" />
        </div>
    );
}
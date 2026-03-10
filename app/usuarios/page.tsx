export default function UsuariosPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Usuários</h1>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Telefone</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Usuário Teste</td>
            <td>teste@email.com</td>
            <td>00000000000</td>
            <td>11999999999</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
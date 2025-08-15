describe('Teste Login PGD', () => {
  it('Realiza login, acessa Plano de Trabalho e seleciona unidade', () => {
    cy.visit('https://hmlpgd.mj.gov.br/Login')

    // Preenche o campo de usuário
    cy.get('#Sigla', { timeout: 10000 }).should('be.visible')
    cy.get('#Sigla').type('rafael.souza5')

    // Preenche o campo senha
    cy.get('input[type="password"]').type('Mjr99212199@@@')
 
    // Clica no botão entrar
    cy.get('#btnLogin').click()

    // Valida que a navegação após o login ocorreu
    cy.url().should('not.include', '/Login')

    // Clica no link "Acessar" do Plano de Trabalho
    cy.contains('div.card-body', 'Plano de Trabalho').within(() => {
      cy.get('a.btn.btn-primary').click()
    })

    // Seleciona o perfil "Chefia"
    cy.contains('label', 'Chefia').click()

    // Clica no botão "Entrar"
    cy.contains('button', 'Entrar').click()

    // Valida que foi redirecionado para /SelecionarUnidade
    cy.url().should('include', '/SelecionarUnidade')

    // Seleciona a unidade "Diretoria do Sistema Único de Segurança Pública"
    cy.get('#IdUnidade').select('1963') // ou .select('Diretoria do Sistema Único de Segurança Pública')

    // Clica no botão "Entrar"
    cy.contains('button', 'Entrar').click()

    // Valida que saiu da tela de seleção de unidade
    cy.url().should('not.include', '/SelecionarUnidade')

      // Valida que foi redirecionado para a página /Pacto
    cy.url().should('include', '/Pacto')

  })
})

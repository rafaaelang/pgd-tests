describe('Teste Login PGD', () => {

  it('Login, navegação e solicitação de Plano de Trabalho', () => {

    cy.visit('https://hmlpgd.mj.gov.br/Login')



    // Login

    cy.get('#Sigla', { timeout: 10000 }).should('be.visible')

    cy.get('#Sigla').type('rafael.souza5')

    cy.get('input[type="password"]').type('Mjr99212199@@@')

    cy.get('#btnLogin').click()



    // Acesso ao Plano de Trabalho

    cy.contains('div.card-body', 'Plano de Trabalho').within(() => {

      cy.get('a.btn.btn-primary').click()

    })



    // Seleção do perfil

    cy.url().should('include', '/SelecionarPerfil')

    cy.contains('label', 'Participante').click()

    cy.get('button').contains('Entrar').click()



    // Seleção da unidade

    cy.url().should('include', '/SelecionarUnidade')

    cy.get('select#IdUnidade').select('Diretoria do Sistema Único de Segurança Pública')

    cy.get('button').contains('Entrar').click()



    // Abre menu Plano de Trabalho e clica em "Solicitar"

    cy.get('#planoTrabalhoDropdown').click()

    cy.get('#menuSolicitar').should('be.visible').click()



    // Aguarda página de solicitação

    cy.url().should('include', '/Pacto/Solicitar?idTipoPacto=1')



    // Seleciona Unidade em Exercício

    cy.get('select[name="IdUnidadeExercicio"]')

      .should('be.visible')

      .select('Diretoria do Sistema Único de Segurança Pública')



    // Calcula a data 10 dias antes da atual (ajustada para dia útil)

    const getValidWeekday = (startDate) => {

      let date = new Date(startDate)

      while (date.getDay() === 0 || date.getDay() === 6) {

        date.setDate(date.getDate() - 1) // Pula fim de semana

      }

      return date

    }



    const today = new Date()

    today.setDate(today.getDate() - 10)

    const validDate = getValidWeekday(today)

    const formattedDate = validDate.toLocaleDateString('pt-BR') // Formato dd/mm/yyyy



    // Preenche o campo de data via JS para funcionar com datepicker

    cy.get('input[name="DataPrevistaInicio"]')

      .should('be.visible')

      .invoke('val', formattedDate)   // Define o valor

      .trigger('change')              // Dispara evento para o sistema reconhecer alteração



    // Validação opcional

    cy.get('input[name="DataPrevistaInicio"]').should('have.value', formattedDate)

  })

})


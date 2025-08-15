describe('Teste Login PGD', () => {
  it('Realiza login, acessa Plano de Trabalho, seleciona Participante e unidade DSUSP', () => {
    cy.visit('https://hmlpgd.mj.gov.br/Login')

    // --- Login ---
    cy.get('#Sigla', { timeout: 15000 })
      .should('be.visible')
      .type(Cypress.env('PGD_USER') || 'rafael.souza5')

    cy.get('input[type="password"]')
      .type(Cypress.env('PGD_PASS') || 'Mjr99212199@@@', { log: false })

    cy.get('#btnLogin').click()
    cy.url().should('not.include', '/Login')

    // --- Acessa Plano de Trabalho ---
    cy.contains('div.card-body', 'Plano de Trabalho', { timeout: 15000 })
      .should('be.visible')
      .within(() => cy.get('a.btn.btn-primary').click())

    // --- Seleciona perfil Participante ---
    cy.get('#perfilSolicitante').check({ force: true }) // garante que marca o radio
    cy.contains('button', 'Entrar').click()

    // --- Seleção de Unidade ---
    cy.url().should('include', '/SelecionarUnidade')

    // Garante que o select apareceu
    cy.get('select#IdUnidade', { timeout: 15000 }).should('be.visible')

    // Confirma que a opção DSUSP existe
    cy.get('select#IdUnidade')
      .find('option[value="1963"]', { timeout: 15000 })
      .should('exist')

    // Seleciona DSUSP por value
    cy.get('select#IdUnidade').select('1963', { force: true })
      .should('have.value', '1963')

    // Clica no Entrar da seleção de unidade
    cy.contains('button', 'Entrar').click()

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

      .invoke('val', formattedDate)  

      .trigger('change')    


    // Validação 

    cy.get('input[name="DataPrevistaInicio"]').should('have.value', formattedDate)


    // --- Grupo de atividade: selecionar "Articulação institucional"
    cy.get('#IdGrupoAtividade', { timeout: 15000 })
    .should('be.visible')
    .select('Articulação institucional'); // pelo texto visível

    // Confere se ficou selecionado
    cy.get('#IdGrupoAtividade option:selected')
    .should('contain', 'Articulação institucional');

    // --- Atividade: selecionar a opção do print
    // Abre o componente (TomSelect) do campo "Atividade"
    cy.get('#IdAtividade', { timeout: 15000 }).should('exist')
    cy.get('#IdAtividade').next('.ts-wrapper').find('.ts-control').click()

    // Clica na opção "Oferta de formações de prevenção ..." (conforme o print)
    cy.get('#IdAtividade-ts-dropdown .option', { timeout: 10000 })
    .contains('Oferta de formações de prevenção')
    .click({ force: true })

    // Valida que aplicou a seleção (o value costuma ser o data-value "12951")
    cy.get('#IdAtividade').should('have.value', '12951')



  })

})
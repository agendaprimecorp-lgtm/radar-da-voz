# Script auxiliar para deploy do Radar da Voz no Vercel
# Uso: .\deploy.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Radar da Voz - Deploy Helper Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configurações
$ProjectPath = Get-Location
$ProjectName = "radar-da-voz"
$VercelURL = "https://radar-da-voz.vercel.app"

# Cores
$GREEN = "Green"
$RED = "Red"
$YELLOW = "Yellow"
$CYAN = "Cyan"

# Função para print colorido
function Log-Success { Write-Host "[✓] $args" -ForegroundColor $GREEN }
function Log-Error { Write-Host "[✗] $args" -ForegroundColor $RED }
function Log-Warn { Write-Host "[!] $args" -ForegroundColor $YELLOW }
function Log-Info { Write-Host "[i] $args" -ForegroundColor $CYAN }

# Menu
function Show-Menu {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Escolha a ação:" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "1. Verificar pré-requisitos"
    Write-Host "2. Fazer build local"
    Write-Host "3. Login no Vercel"
    Write-Host "4. Vincular projeto com Vercel"
    Write-Host "5. Fazer deploy em produção"
    Write-Host "6. Ver logs de deployment"
    Write-Host "7. Listar deployments"
    Write-Host "8. Verificar variáveis de ambiente"
    Write-Host "9. Executar todos os passos"
    Write-Host "0. Sair"
    Write-Host "`n========================================`n" -ForegroundColor Cyan
}

# Funções de ação
function Check-Prerequisites {
    Write-Host "`nVerificando pré-requisitos...`n" -ForegroundColor $CYAN

    # Node
    try {
        $nodeVersion = node --version
        Log-Success "Node.js: $nodeVersion"
    }
    catch {
        Log-Error "Node.js não encontrado. Baixar em https://nodejs.org/"
        return
    }

    # npm
    try {
        $npmVersion = npm --version
        Log-Success "npm: $npmVersion"
    }
    catch {
        Log-Error "npm não encontrado"
        return
    }

    # Vercel CLI
    try {
        $vercelVersion = vercel --version
        Log-Success "Vercel CLI: $vercelVersion"
    }
    catch {
        Log-Warn "Vercel CLI não encontrado. Instalando..."
        npm install -g vercel
    }

    # Git
    try {
        $gitVersion = git --version
        Log-Success "Git: $gitVersion"
    }
    catch {
        Log-Error "Git não encontrado"
        return
    }

    Write-Host "`n✓ Todos os pré-requisitos OK!" -ForegroundColor $GREEN
}

function Build-Project {
    Write-Host "`nFazendo build do projeto...`n" -ForegroundColor $CYAN

    npm run build

    if ($LASTEXITCODE -eq 0) {
        Log-Success "Build completado com sucesso!"
    }
    else {
        Log-Error "Build falhou com erro"
        exit 1
    }
}

function Login-Vercel {
    Write-Host "`nFazendo login no Vercel...`n" -ForegroundColor $CYAN
    Write-Host "Siga as instruções na janela do navegador que se abrir.`n" -ForegroundColor $YELLOW

    vercel login

    if ($LASTEXITCODE -eq 0) {
        Log-Success "Login realizado com sucesso!"
    }
    else {
        Log-Error "Falha ao fazer login"
        exit 1
    }
}

function Link-Project {
    Write-Host "`nVinculando projeto com Vercel...`n" -ForegroundColor $CYAN
    Write-Host "Siga as instruções abaixo:`n" -ForegroundColor $YELLOW
    Write-Host "1. Escolha 'Y' para configurar e fazer deploy"
    Write-Host "2. Escolha seu escopo (GitHub user)"
    Write-Host "3. Escolha 'Y' para linkar com projeto existente (se houver)"
    Write-Host "`n"

    vercel link

    if ($LASTEXITCODE -eq 0) {
        Log-Success "Projeto vinculado com sucesso!"
        Log-Warn "PRÓXIMA ETAPA: Adicione as variáveis de ambiente em:"
        Write-Host "https://vercel.com/dashboard`n"
    }
    else {
        Log-Error "Falha ao vincular projeto"
        exit 1
    }
}

function Deploy-Production {
    Write-Host "`nAguarde... Fazendo deploy em PRODUÇÃO...`n" -ForegroundColor $CYAN
    Write-Host "Tempo estimado: 2-5 minutos`n" -ForegroundColor $YELLOW

    vercel deploy --prod

    if ($LASTEXITCODE -eq 0) {
        Log-Success "Deploy completado com sucesso!"
        Log-Info "Acessar em: $VercelURL"
        Write-Host "`nPróximos passos:`n"
        Write-Host "1. Configurar Stripe webhook: https://dashboard.stripe.com/webhooks"
        Write-Host "2. Adicionar CORS no Supabase: https://app.supabase.com"
        Write-Host "3. Whitelist Cloudinary: https://cloudinary.com/console"
        Write-Host "`n"
    }
    else {
        Log-Error "Deploy falhou"
        exit 1
    }
}

function Show-Logs {
    Write-Host "`nMostrando logs de deployment...`n" -ForegroundColor $CYAN
    Write-Host "Pressione Ctrl+C para sair`n" -ForegroundColor $YELLOW

    vercel logs $VercelURL --follow
}

function List-Deployments {
    Write-Host "`nListando deployments...`n" -ForegroundColor $CYAN

    vercel list
}

function Check-Environment {
    Write-Host "`nVerificando variáveis de ambiente...`n" -ForegroundColor $CYAN

    vercel env list

    Log-Warn "IMPORTANTE: Adicione todas as variáveis em:"
    Write-Host "https://vercel.com/dashboard → Project Settings → Environment Variables`n"
}

function Run-All-Steps {
    Write-Host "`n" -ForegroundColor $CYAN
    Write-Host "Executando todos os passos de deploy..." -ForegroundColor $CYAN
    Log-Warn "Pressione Ctrl+C para cancelar`n"

    Read-Host "Pressione Enter para continuar"

    # 1. Check prerequisites
    Check-Prerequisites

    # 2. Build
    Write-Host "`n" -ForegroundColor $CYAN
    Log-Info "Etapa 2 de 5: Build do projeto"
    Read-Host "Pressione Enter para continuar"
    Build-Project

    # 3. Login
    Write-Host "`n" -ForegroundColor $CYAN
    Log-Info "Etapa 3 de 5: Login no Vercel"
    Read-Host "Pressione Enter para continuar"
    Login-Vercel

    # 4. Link
    Write-Host "`n" -ForegroundColor $CYAN
    Log-Info "Etapa 4 de 5: Vincular projeto"
    Read-Host "Pressione Enter para continuar"
    Link-Project

    Write-Host "`n" -ForegroundColor $RED
    Write-Host "========================================" -ForegroundColor $RED
    Write-Host "⚠️  PAUSADO PARA CONFIGURAÇÃO MANUAL" -ForegroundColor $RED
    Write-Host "========================================`n" -ForegroundColor $RED

    Log-Warn "Você DEVE adicionar as variáveis de ambiente antes de fazer o deploy!"
    Log-Info "Abra: https://vercel.com/dashboard"
    Log-Info "Projeto: radar-da-voz"
    Log-Info "Settings → Environment Variables"
    Log-Info "Adicione as 20+ variáveis listadas em DEPLOY_INSTRUCTIONS.md"

    Log-Warn "`nPressione 'S' quando terminar de adicionar as variáveis"
    $response = Read-Host "Continuar com deploy em produção? (S/N)"

    if ($response -eq "S" -or $response -eq "s") {
        # 5. Deploy
        Write-Host "`n" -ForegroundColor $CYAN
        Log-Info "Etapa 5 de 5: Deploy em produção"
        Deploy-Production
    }
    else {
        Log-Error "Deploy cancelado pelo usuário"
        exit 1
    }
}

# Loop principal
$continua = $true

while ($continua) {
    Show-Menu
    $escolha = Read-Host "Digite sua escolha"

    switch ($escolha) {
        "1" { Check-Prerequisites }
        "2" { Build-Project }
        "3" { Login-Vercel }
        "4" { Link-Project }
        "5" { Deploy-Production }
        "6" { Show-Logs }
        "7" { List-Deployments }
        "8" { Check-Environment }
        "9" { Run-All-Steps }
        "0" {
            Log-Info "Até logo!"
            $continua = $false
        }
        default {
            Log-Error "Opção inválida. Tente novamente."
        }
    }
}

Log-Success "`nScript finalizado!`n"

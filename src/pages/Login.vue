<template>
  <div class="login-page">
    <div class="bg-image" aria-hidden="true"></div>

    <div class="overlay"></div>

    <main class="login-container" role="main">
      <section class="login-card" aria-labelledby="login-title">
        <img src="@/assets/img/logo_money_track.png" alt="" />
        <h3>Money Track</h3>

        <form @submit.prevent="submit" class="form" novalidate>
          <label class="field">
            <span class="label-text">E‑mail</span>
            <input
              v-model="email"
              type="email"
              required
              placeholder="seu@exemplo.com"
              autocomplete="username"
            />
            <small v-if="errors.email" class="error">{{ errors.email }}</small>
          </label>

          <label class="field">
            <span class="label-text">Senha</span>
            <div class="password-row">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle"
                @click="showPassword = !showPassword"
                :aria-pressed="showPassword"
              >
                {{ showPassword ? "Ocultar" : "Mostrar" }}
              </button>
            </div>
            <small v-if="errors.password" class="error">{{
              errors.password
            }}</small>
          </label>

          <div class="row between">
            <label class="checkbox">
              <input type="checkbox" v-model="remember" />
              <span>Lembrar-me</span>
            </label>

            <a href="#" class="forgot" @click.prevent="forgot"
              >Esqueceu a senha?</a
            >
          </div>

          <button class="btn primary" type="submit">Entrar</button>

          <div class="divider">ou</div>

          <div class="socials">
            <button
              type="button"
              class="btn alt"
              @click.prevent="oauth('google')"
            >
              Entrar com Google
            </button>
            <button
              type="button"
              class="btn alt"
              @click.prevent="oauth('apple')"
            >
              Entrar com Apple
            </button>
          </div>

          <p class="signup">
            Não tem conta? <a href="#" @click.prevent="signup">Crie uma</a>
          </p>
        </form>

        <footer class="credit">
          Imagem de fundo: troque por uma que remeta a finanças pessoais
          (gráficos, cofrinho, recibos)
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const email = ref("");
const password = ref("");
const remember = ref(false);
const showPassword = ref(false);

const errors = reactive({ email: "", password: "" });

function validate() {
  errors.email = "";
  errors.password = "";

  if (!email.value) errors.email = "E‑mail é obrigatório.";
  else if (!/^\S+@\S+\.\S+$/.test(email.value))
    errors.email = "E‑mail inválido.";

  if (!password.value) errors.password = "Senha é obrigatória.";
  else if (password.value.length < 6)
    errors.password = "A senha deve ter ao menos 6 caracteres.";

  return !errors.email && !errors.password;
}

function submit() {
  if (!validate()) return;

  // Substitua por chamada real à API / store
  console.log("Entrando com", {
    email: email.value,
    password: "***",
    remember: remember.value,
  });
  // exemplo: await auth.signIn(email.value, password.value)
  // redirecionar após login
  alert("Login simulado — implemente a integração com sua API");
}

function oauth(provider) {
  alert(`OAuth: implementar fluxo com ${provider}`);
}

function forgot() {
  alert("Fluxo de recuperação de senha — implemente conforme sua rota");
}

function signup() {
  alert("Ir para cadastro — implemente navegação");
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
  color: #0f172a;
}

.bg-image {
  position: absolute;
  inset: 0;
  background-image: url("@/assets/img/finance-bg.png"); /* troque pela sua imagem */
  background-size: cover;
  background-position: center;
  filter: saturate(0.9) contrast(1.05);
  z-index: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.6),
    rgba(245, 247, 250, 0.8)
  );
  z-index: 1;
}

.login-container {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.1);
  padding: 2rem;
  text-align: center;
}

.login-card h1 {
  margin: 0 0 0.25rem 0;
  font-size: 1.375rem;
}
.subtitle {
  color: #334155;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.form {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.field {
  text-align: left;
}
.label-text {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}
input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e6edf3;
  font-size: 0.95rem;
}
.password-row {
  display: flex;
  gap: 0.5rem;
}
.password-row .toggle {
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  align-self: center;
}

.row.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkbox {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.forgot {
  font-size: 0.85rem;
  color: #0ea5a4;
  text-decoration: none;
}
.btn {
  width: 100%;
  padding: 0.7rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.btn.primary {
  background: linear-gradient(90deg, #0ea5a4, #0891b2);
  color: #fff;
}
.btn.alt {
  background: transparent;
  border: 1px solid #cfd8e3;
}
.divider {
  text-align: center;
  margin: 0.5rem 0;
  color: #64748b;
}
.socials {
  display: grid;
  gap: 0.5rem;
}
.error {
  color: #b91c1c;
  font-size: 0.8rem;
}
.signup {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.credit {
  font-size: 0.76rem;
  color: #94a3b8;
  margin-top: 0.75rem;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.25rem;
    border-radius: 10px;
  }
}
</style>

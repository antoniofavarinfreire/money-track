<template>
  <div class="login-page">
    <div class="bg-image" aria-hidden="true"></div>

    <div class="overlay"></div>

    <main class="login-container" role="main">
      <section class="login-card" aria-labelledby="login-title">
        <img src="@/assets/img/logo_money_track.png" alt="" />
        <h3>Money Track</h3>
        <h4>Registre-se</h4>
        <form @submit.prevent="submit" class="form" novalidate>
          <label class="field">
            <span class="label-text">Nome Usuário</span>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Seu nome"
              autocomplete="username"
            />
            <small v-if="errors.name" class="error">{{ errors.name }}</small>
          </label>
          <label class="field">
            <span class="label-text">E‑mail</span>
            <input
              v-model="email"
              type="email"
              required
              placeholder="seu@email.com"
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
            </div>
            <small v-if="errors.password" class="error">{{
              errors.password
            }}</small>
          </label>

          <label class="field">
            <span class="label-text">Confirmar Senha</span>
            <div class="password-row">
              <input
                v-model="confirmpassword"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-icon"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                :aria-pressed="showPassword"
              >
                <span class="material-icons">
                  {{ showPassword ? "visibility_off" : "visibility" }}
                </span>
              </button>
            </div>
            <small v-if="errors.confirmpassword" class="error">{{
              errors.confirmpassword
            }}</small>
          </label>
          <button class="btn primary" type="submit">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm mr-2"
              role="status"
              aria-hidden="true"
            />
            {{ loading ? "" : "Registrar" }}
          </button>

          <p class="signup">
            Já tem conta? <a href="#" @click.prevent="signIn">Faça login</a>
          </p>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import axios from "axios";
const { proxy } = getCurrentInstance();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmpassword = ref("");
const showPassword = ref(false);
const loading = ref(false);

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmpassword: "",
});

function validate() {
  errors.name = "";
  errors.email = "";
  errors.password = "";
  errors.confirmpassword = "";

  if (!name.value) errors.name = "Campo obrigatório";
  if (!email.value) errors.email = "E‑mail é obrigatório.";
  else if (!/^\S+@\S+\.\S+$/.test(email.value))
    errors.email = "E‑mail inválido.";

  if (!password.value) errors.password = "Senha é obrigatória.";
  else if (password.value.length < 6)
    errors.password = "A senha deve ter ao menos 6 caracteres.";

  if (confirmpassword.value !== password.value)
    errors.confirmpassword = "As senhas devem ser iguais";
  else if (confirmpassword.value.length === 0)
    errors.confirmpassword = "Campo não deve ser vazio";
  return !errors.email && !errors.password && !errors.confirmpassword;
}

async function submit() {
  if (!validate()) return;

  loading.value = true;
  try {
    const response = await axios.post(
      "https://money-track-service-hqb8fshta4hzadez.eastus2-01.azurewebsites.net/users/create-user", // ajuste se necessário
      {
        name: name.value,
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    alert("Usuário criado com sucesso!");

    // redirecionar após cadastro
    proxy.$router.push("/login");
  } catch (error) {
    if (error.response?.data?.error === "Email já cadastrado") {
      errors.email = "Este e-mail já está em uso.";
    } else {
      alert("Erro ao registrar usuário. Tente novamente mais tarde.");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  } finally {
    loading.value = false;
  }
}

function signIn() {
  proxy.$router.push("/login");
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

.password-row {
  position: relative;
  width: 100%;
}

.password-row input {
  width: 100%;
  padding-right: 45px; /* espaço para o botão */
}

.toggle-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;
}

.toggle-icon:hover {
  color: #333;
}

.toggle-icon:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  border-radius: 4px;
}

.material-icons {
  font-size: 20px;
}

.btn.primary {
  transition: all 0.2s ease-in-out;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.25rem;
    border-radius: 10px;
  }
}
</style>

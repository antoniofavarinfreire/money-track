<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Editar Perfil</h4>
        <p class="category">Complete seu perfil</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Email Address</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Name</label>
              <md-input v-model="firstname" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-40">
            <md-field>
              <label>Nova Senha</label>
              <md-input v-model="password" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Confirme nova senha </label>
              <md-input v-model="confirmPassword" type="password"></md-input>
            </md-field>
          </div>
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
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      username: null,
      disabled: null,
      emailadress: null,
      lastname: null,
      firstname: null,
      password: null,
      confirmPassword: null,
    };
  },
};
</script>
<style></style>

<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <!-- login -->
        <q-card bordered class="q-pa-lg shadow-1 login" v-if="login_form">
          <p class="text-center text-h6 q-mb-lg">{{ $t("auth.login") }}</p>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="submit('login')">
              <q-input
                dense
                v-model.trim="login.email"
                :label="$t('labels.email')"
                :hint="$t('hints.email')"
                @input="$v.login.email.$touch()"
                :rules="[
                  val => $v.login.email.required || $t('auth.fill'),
                  val => $v.login.email.email || $t('rules.email')
                ]"
              />
              <q-input
                dense
                type="password"
                v-model.trim="login.password"
                :label="$t('labels.password')"
                :hint="$t('hints.password')"
              />
              <q-card-actions class="q-px-md">
                <q-btn
                  unelevated
                  color="primary"
                  size="lg"
                  class="full-width"
                  label="Submit"
                  type="submit"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6 pointer" @click="switch_form(`register`)">
              {{ $t("register.signup") }}
            </p>
            <p class="text-grey-6 pointer" @click="switch_form(`forgot`)">
              {{ $t("auth.forgot_pass") }}
            </p>
          </q-card-section>
        </q-card>
        <!-- register -->
        <q-card
          bordered
          class="q-pa-lg shadow-1 register_card"
          v-if="register_form"
        >
          <p class="text-center text-h6">{{ $t("register.register") }}</p>
          <q-card-section>
            <q-form @submit.prevent="submit('register')">
              <div class="row">
                <div class="col">
                  <q-input
                    dense
                    v-model.trim="register.first_name"
                    :label="$t('labels.first_name')"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || $t('auth.fill')]"
                  />
                </div>
                <div class="q-ml-md col">
                  <q-input
                    dense
                    v-model.trim="register.last_name"
                    :label="$t('labels.last_name')"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || $t('auth.fill')]"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-input
                    dense
                    v-model.trim="register.email"
                    :label="$t('labels.email')"
                    @input="$v.register.email.$touch()"
                    :rules="[
                      val => $v.register.email.required || $t('auth.fill'),
                      val => $v.register.email.email || $t('rules.email')
                    ]"
                  />
                </div>
                <div class="q-ml-md col">
                  <q-input
                    dense
                    v-model.trim="register.profile.profession"
                    label="Profession *"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 0) || $t('register.occupation')
                    ]"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-input
                    dense
                    v-model.trim="register.profile.institution"
                    label="Institution *"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || $t('auth.fill')]"
                  />
                </div>
                <div class="q-ml-md col">
                  <q-input
                    dense
                    v-model="register.profile.title"
                    :label="$t('register.title')"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-input
                    dense
                    type="password"
                    v-model="register.password"
                    :label="$t('labels.password')"
                    @input="$v.register.password.$touch()"
                    :rules="[
                      val => $v.register.password.required || $t('auth.fill'),
                      val =>
                        $v.register.password.minLength || $t('rules.password')
                    ]"
                  />
                </div>
                <div class="col q-ml-md">
                  <q-input
                    dense
                    type="password"
                    v-model.trim="register.password2"
                    :label="$t('labels.repeat_password')"
                    @input="$v.register.password2.$touch()"
                    :rules="[
                      val => $v.register.password2.required || $t('auth.fill'),
                      val => $v.register.password2.sameAs || $t('rules.match')
                    ]"
                  />
                </div>
              </div>
              <q-card-actions class="q-mt-md">
                <q-btn
                  unelevated
                  color="primary"
                  size="lg"
                  class="full-width"
                  type="submit"
                  label="Register"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6 pointer" @click="switch_form(`login`)">
              {{ $t("register.login_link") }}
            </p>
          </q-card-section>
        </q-card>
        <!-- forgot password -->
        <q-card bordered class="q-pa-lg shadow-1" v-if="forgot_form">
          <p class="text-h6 text-center">{{ $t("resetPass.forgotpass") }}</p>
          <p class="text-center">{{ $t("resetPass.resetstm") }}</p>
          <q-card-section>
            <q-form @submit.prevent="submit('forgotpassword')">
              <q-input
                dense
                v-model="$v.forgotpassword.$model"
                :label="$t('labels.email')"
                :hint="$t('hints.email')"
                @input="$v.forgotpassword.$touch()"
                :rules="[
                  val => $v.forgotpassword.required || $t('auth.fill'),
                  val => $v.forgotpassword.email || $t('rules.email')
                ]"
              />
              <q-card-actions class="q-px-md">
                <q-btn
                  unelevated
                  color="primary"
                  size="lg"
                  class="full-width"
                  label="Submit"
                  type="submit"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6 pointer" @click="switch_form(`login`)">
              {{ $t("auth.login") }}
            </p>
          </q-card-section>
        </q-card>
        <!-- reset password input -->
        <q-card bordered class="q-pa-lg shadow-1" v-if="new_password_form">
          <p class="text-h6 text-center">{{ $t("resetPass.forgotpass") }}</p>
          <p class="text-center">{{ $t("resetPass.newpass") }}</p>
          <q-card-section>
            <q-form @submit.prevent="submit('resetpassword')">
              <q-input
                dense
                type="password"
                v-model="reset.password"
                :label="$t('labels.password')"
                @input="$v.reset.password.$touch()"
                :rules="[
                  val => $v.reset.password.required || $t('auth.fill'),
                  val => $v.reset.password.minLength || $t('rules.password')
                ]"
              />
              <q-input
                dense
                type="password"
                v-model.trim="reset.password2"
                :label="$t('labels.repeat_password')"
                @input="$v.reset.password2.$touch()"
                :rules="[
                  val => $v.reset.password2.required || $t('auth.fill'),
                  val => $v.reset.password2.sameAs || $t('rules.match')
                ]"
              />
              <q-card-actions class="q-px-md">
                <q-btn
                  unelevated
                  color="primary"
                  size="lg"
                  class="full-width"
                  label="Submit"
                  type="submit"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6 pointer" @click="switch_form(`login`)">
              {{ $t("auth.login") }}
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import RegisterData from "src/Mixins/UserRegData";
import { positive, negative } from "src/Services/Notifications";
import { resetpass } from "src/store/auth/actions";
export default {
  mixins: [validationMixin, RegisterData],
  name: "Login",
  data() {
    return {
      //booleans to determin which form is loaded to DOM
      register_form: false,
      login_form: true,
      forgot_form: false,
      new_password_form: false,
      PathItems: {}, // stores the path parameters from router
      //form details
      login: {
        email: null,
        password: null
      },
      forgotpassword: null,
      reset: {
        password: null,
        password2: null
      }
    };
  },
  validations: {
    //validations for the various inputs
    forgotpassword: {
      required,
      email: email
    },
    login: {
      email: {
        required,
        email: email
      }
    },
    reset: {
      password: {
        required,
        minLength: minLength(8)
      },
      password2: {
        required,
        sameAs: sameAs(function() {
          return this.reset.password;
        })
      }
    },
    register: {
      password: {
        required,
        minLength: minLength(8)
      },
      email: {
        required,
        email: email
      },
      password2: {
        required,
        sameAs: sameAs(function() {
          return this.register.password;
        })
      }
    }
  },
  methods: {
    switch_form(form) {
      //function which checks which form to show/load to DOM

      if (form === "login") {
        //only show login
        this.register_form = false;
        this.login_form = true;
        this.forgot_form = false;
        this.new_password_form = false;
      } else if (form === "register") {
        //only show register
        this.register_form = true;
        this.login_form = false;
        this.forgot_form = false;
        this.new_password_form = false;
      } else {
        //show fiorgot password form
        this.forgot_form = true;
        this.register_form = false;
        this.login_form = false;
        this.new_password_form = false;
      }
    },
    async submit(model) {
      //common submit function/ the model will determin which  action to dispatch
      this.$Log("Form login", model, " ", this[model]);
      switch (model) {
        case "register": //trigger register action
          let message = await this.$store.dispatch(
            "auth/register",
            this.register
          );
          if (message) {
            //show login after register
            this.switch_form("login");
          }
          break;
        case "login": //trigger login funnction
          return await this.$store.dispatch("auth/login", this.login);
          break;
        case "forgotpassword": //trigger password reset function
          return await this.$store.dispatch("auth/resetpass", {
            email: this.forgotpassword
          });
          break;
        case "resetpassword": //gets new password reset function
          this.PathItems.new_password = this.reset.password;
          this.PathItems.confirm_password = this.reset.password2;
          return await this.$store.dispatch(
            "auth/setnewpassword",
            this.PathItems
          );
          break;
      }
    },
    async activate(pathItems) { // function to activate user when user clicks the email link
      try {
        let user = await this.$axios.get(`/api${pathItems}`); //get the details from the link clicked from email and make reuest
        if (user) {
          this.$Log("Activate User  ", user.data.message);
          positive(user.data.message, 0); //show confirmation toast to user
          if (this.getLoggedIn) { // if the user logs in we redirect to dashboard page
            this.$router.push("/dashboard").catch(err => {});
          }else{
            this.$router.push("/login").catch(err => {});
          }
        }
      } catch (error) {
        this.$Log("Error in Activate User ", error);
        negative("Activation link is invalid", 5000); //show user activation link is invalid
        if (this.getLoggedIn) {
          this.$router.push("/dashboard").catch(err => {});
        }
      }
    },
    async ResetPasswordDetails(pathItems) {
      this.new_password_form = true;
      this.PathItems = {
        uid: pathItems.split("/")[2], //get uid from path
        token: pathItems.split("/")[3] //get token from path
      };
      this.$Log(
        "ResetPasswordDetails ",
        pathItems.split("/"),
        "PathItems ",
        this.PathItems
      );
    }
  },
  async mounted() {
    let pathItems = this.$router.currentRoute.path;
    let actiave_url =`/${pathItems.split('/').slice(-4).join('/')}`
    this.$Log(
      "Activate active ",
      actiave_url,
      "starts ",
      pathItems.startsWith("/dashboard/activate")
    );
    if (!pathItems.startsWith("/login")) this.login_form = false;
    if (pathItems.startsWith("/dashboard/activate")) this.activate(actiave_url);
    if (pathItems.startsWith("/forgotpassword"))
      this.ResetPasswordDetails(pathItems);
  },
  computed: {
    getLoggedIn() {
      // check if user is logged in or not
      return this.$store.getters["auth/loggedin"];
    }
  }
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.q-card {
  border-radius: 20px;
  border: 4px solid #00695c;
  width: 330px;
}
@media screen and (min-width: 1024px) {
  .q-card {
    border-radius: 20px;
    width: 380px;
  }
}
</style>

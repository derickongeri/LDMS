<template>
  <div class="q-pa-md">
   <div :class="getuploadValue==100?`text-h6 text-green`:`text-orange text-h6`" v-if="getuploadValue ">
      Uploading Process {{ getuploadValue }}%
   </div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        dense
        v-model="user_email"
        label="Email *"
        @input="$v.user_email.$touch()"
        :rules="[
          val => $v.user_email.required || 'Email is required',
          val => $v.user_email.email || 'Price must be a number'
        ]"
      />
      <q-input
        filled
        dense
        v-model="title"
        label="Title *"
        @input="$v.title.$touch()"
        :rules="[val => $v.title.required || 'Title is required']"
      />
      <q-editor
        @paste.native="evt => pasteCapture(evt)"
        @drop.native="evt => dropCapture(evt)"
        v-model="feeback_text"
        min-height="20rem"
        :toolbar="[
          [
            {
              label: $q.lang.editor.align,
              icon: $q.iconSet.editor.align,
              fixedLabel: true,
              list: 'only-icons',
              options: ['left', 'center', 'right', 'justify']
            },
            {
              label: $q.lang.editor.align,
              icon: $q.iconSet.editor.align,
              fixedLabel: true,
              options: ['left', 'center', 'right', 'justify']
            }
          ],
          ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
          ['token', 'hr', 'link', 'custom_btn'],
          ['print', 'fullscreen'],
          [
            {
              label: $q.lang.editor.formatting,
              icon: $q.iconSet.editor.formatting,
              list: 'no-icons',
              options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
            },
            {
              label: $q.lang.editor.fontSize,
              icon: $q.iconSet.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7'
              ]
            },
            {
              label: $q.lang.editor.defaultFont,
              icon: $q.iconSet.editor.font,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'default_font',
                'arial',
                'arial_black',
                'comic_sans',
                'courier_new',
                'impact',
                'lucida_grande',
                'times_new_roman',
                'verdana'
              ]
            },
            'removeFormat'
          ],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

          ['undo', 'redo'],
          ['viewsource']
        ]"
        :fonts="{
          arial: 'Arial',
          arial_black: 'Arial Black',
          comic_sans: 'Comic Sans MS',
          courier_new: 'Courier New',
          impact: 'Impact',
          lucida_grande: 'Lucida Grande',
          times_new_roman: 'Times New Roman',
          verdana: 'Verdana'
        }"
      />
      <div id="gallery"></div>
      <div class="row justify-between">
        <q-btn flat label="Submit" type="submit" color="primary" />
        <q-btn
          label="Cancel"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import firebase from "firebase";
import { uid } from "quasar";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  data() {
    return {
      feeback_text: "",
      user_email: null,
      title: null,
      uploadValue: 0,
      Img_Urls:[],
      urls:[],
    };
  },
  validations: {
    user_email: {
      required,
      email
    },
    title: {
      required
    }
  },
  computed:{
    getuploadValue(){
      return Math.floor(this.uploadValue)
    }
  },
  methods: {
    async onSubmit() {
      try {
        let url = `https://api.github.com/repos/note5/TestApi/issues`;
        let data = {
          title: `${this.title} ${this.user_email ? "by" : ""} ${
            this.user_email ? this.user_email : ""
          }`,
          body: this.feeback_text
          //   labels: ["bug"]
        };
        this.$Log("text body ", this.urls);
        // return
        let response = await this.$axios.post(url, data, {
          headers: {
            Authorization: `Bearer 0d52209c864bee30b46016aeed15e3ad422e930c`
          }
        });
        if (response) {
          this.$q.notify({
            message: "Thank you for your Feedback",
            color: "green-4",
            textColor: "white",
            icon: "thumb_up"
          });
        }
        // this.$router.go(-1);
        this.$Log("Github Issues resp", response.status);
      } catch (error) {
        this.$Log("User Feedback error", error);
      }
    },
    onReset() {
      this.user_email = null;
      this.title = null;
      this.feeback_text = "";
      this.$router.go(-1);
    },
    pasteCapture(e) {
      // e.preventDefault();
      // e.stopPropagation();
      let dt = e.clipboardData;
      let files = dt.files;
      if (files.length) this.handleFiles(files);
      this.$Log("pasteCapture ", files.length);
    },
    dropCapture(e) {
      e.preventDefault();
      e.stopPropagation();
      let dt = e.dataTransfer;
      let files = dt.files;
      this.handleFiles(files);
      this.$Log("dropCapture files", files.length);
    },
    handleFiles(files) {
      files = [...files];
      files.forEach(this.upload_image);
      files.forEach(this.previewFile);
    },
    previewFile(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function() {
        let img = document.createElement("img");
        img = reader.result;
      };
    },
    upload_image(file) {
      try {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let img = null;
        let self = this;
        reader.onloadend = async function() {
          img = reader.result;
          let base64result = reader.result.substr(
            reader.result.indexOf(",") + 1
          );
          if (process.env.DEV) console.log("base64result ", file.name);

          let id = uid();
         
          const storageRef = firebase
            .storage()
            .ref(`${id}_${file.name}`)
            .put(file);
          storageRef.on(
            `state_changed`,
            snapshot => {
              self.uploadValue =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (process.env.DEV)
                console.log("upload percentage ", self.uploadValue);
            },
            error => {
              if (process.env.DEV) console.log(error.message);
            },
            () => {
              self.uploadValue = 100;
              storageRef.snapshot.ref.getDownloadURL().then(url => {
                self.url = url;
                console.log(url);
               self.feeback_text= self.feeback_text.concat('<div><img src="' + self.url  + '" style="width:300px;object-fit:contain;"/></div>')
             
                self.Img_Urls.push(url)
              });
            }
          );
        };
      } catch (error) {
        this.$Log("imgResp error ", error);
      }
    }
  }
};
</script>

<style></style>

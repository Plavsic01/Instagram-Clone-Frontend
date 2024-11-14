<script setup lang="js">
import { useDataStore } from "@/stores/data";
import { ref,defineEmits } from "vue";
import { Button } from "../../ui/button";
import { toast } from "@/utils/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const dataStore = useDataStore();

const postToCreate = ref({});
const description = ref("");

const emit = defineEmits(["post-created"]);


const handleFileChange = (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append("file", file);
  postToCreate.value = { formData: formData };
}


const createPost = async () => {
  try {
    postToCreate.value.formData.append("description", description.value);
    const post = await dataStore.createPost(postToCreate.value.formData);
    toast.success("Image uploaded successfully!");
    emit("post-created", post);
  } catch (error) {
    toast.error("Error uploading image:", error.message);
  }finally{
    description.value = "";
    postToCreate.value = {};
  }
};
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline"> Create Post </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create post</DialogTitle>
        <DialogDescription>
          Upload image and set description. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" @change="handleFileChange" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right"> Description </Label>
          <Input id="description" v-model="description" class="col-span-3" />
        </div>
      </div>
      <DialogClose v-if="postToCreate.formData && description">
        <Button @click="createPost">Create post</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>

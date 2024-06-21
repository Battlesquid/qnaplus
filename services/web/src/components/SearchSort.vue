<script setup lang="ts">
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import OverlayPanel from 'primevue/overlaypanel';
import InputSwitch from 'primevue/inputswitch';

import { ref } from 'vue';

const panel = ref();
// const advanced = ref<boolean>(false);

const toggle = (e: Event) => {
    panel.value.toggle(e);
}

</script>

<template>
    <Button label="Sort" @click="toggle"></Button>
    <OverlayPanel ref="panel">
        <div class="flex flex-column w-25rem">
            <div class="flex align-items-center justify-content-between">
                <h3 class="m-0">Sort</h3>
                <div class="flex align-items-center">
                    <span>Advanced</span>
                    <InputSwitch />
                </div>
            </div>
            <Divider />
        </div>
    </OverlayPanel>
</template>

<style scoped></style>
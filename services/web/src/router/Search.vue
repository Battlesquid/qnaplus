<script setup lang="ts">
import SearchFilters from "../components/SearchFilters.vue";
import SearchInput from "../components/SearchInput.vue";
</script>

<template>
    <div class="h-full flex flex-column gap-2 p-2">
        <div class="flex flex-column gap-2">
            <SearchInput />
            <SearchFilters />
        </div>
        <div class="h-full overflow-y-auto">
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.

                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit,
                sed
                quia non numquam eius modi.

                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum
                fuga.
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                eligendi optio cumque nihil impedit quo minus.

                Quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                Temporibus
                autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates
                repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut
                aut
                reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat
            </div>
        </div>
    </div>
</template>

<style>
</style>

<template>
	<div>
		<v-input 
			:value="localValue"
			:db-safe="dbSafe"
			:placeholder="placeholder"
			:class="hasError && 'error'"		
			@input="handleInput"
		>
			<template #append>
				<v-icon v-if="hasError === null && localValue" name="launch" @click="setDialogShow" style="color: var(--green)" />
				<v-icon v-if="hasError" name="error" style="color: var(--red)" />
				<v-icon v-if="loading" name="sync" class="loader" />
			</template>
		</v-input>
		<v-notice v-if="hasError" type="warning">
			{{ hasError }}
		</v-notice>
		<v-dialog
			:active="dialogShow !== null"
			@toggle="unsetDialogShow"
			@esc="unsetDialogShow"
		>
			<v-card>
				<v-card-title>Preview</v-card-title>
				<v-card-text>
					<img class="preview-image" :src="localValue" />
				</v-card-text>
				<v-card-actions>
					<v-button secondary @click="unsetDialogShow">
						Close
					</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>


<script>
export default {
	props: {
		value: {
			type: String,
			default: null,
		},
		dbSafe: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: null,
		},
	},
	data: function() {
		return {
			loading: false,
			localValue: this.value,
			dialogShow: null,
			hasError: false
		};
	},
	watch: {
		value: function(newVal, oldVal) {
			if (!oldVal && newVal) {
				this.localValue = newVal;

				if(this.isUri(newVal) && this.checkUrl(newVal)) {
					this.hasError = null
				}
			}
		}
	},
	methods: {
		handleInput: function(val) {
			if(val) {
				let typing;
				const self = this;
				
				this.hasError = false;
				this.localValue = val;
				this.loading = true;

				clearTimeout(typing);
				typing = setTimeout(function(){
					self.loading = false;
					self.processUrl(val);
				}, 1000)
			} else {
				this.processUrl(val);
			}
		},
		setDialogShow: function() {
			this.dialogShow = true;
		},
		unsetDialogShow: function() {
			this.dialogShow = null;
		},
		isUri: function(url) {
			try {
				new URL(url);
			} catch (error) {
				return false;
			}
			return true;
		},
		checkUrl: function(url) {
			return url?.match(/\.(jpeg|jpg|gif|png)$/) != null;
		},
		processUrl: function(url) {
			if(!url) {
				this.hasError = false;
				this.localValue = '';
				this.$emit("input", null);
				return false;
			}

			if(!this.isUri(url)) {
				this.hasError = "Invalid URL";
				return false;
			}

			if(!this.checkUrl(url)) {
				this.hasError = "Invalid URL extension";
				return false;
			}

			this.hasError = null;
			this.$emit("input", url);
			return true;
		}
	}
};
</script>

<style>
@keyframes spin-loader {
	100% {
		transform: rotate(360deg);
	}
}

.v-card-actions, .v-card-title {
	justify-content: center;
}
.preview-image {
	display: block;
	margin: auto;
	max-width: 100%;
    max-height: 66vh;
}

.loader {
	animation: spin-loader 1s infinite;
	animation-timing-function: linear;
}

.error > .input {
	border-color: var(--red) !important;
}
</style>
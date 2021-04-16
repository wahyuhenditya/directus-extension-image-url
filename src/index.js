import InterfaceComponent from "./interface.vue";

export default {
	id: "image-preview",
	name: "Image URL",
	description: "Validate & preview image from inputted Link",
	icon: "image_search",
	component: InterfaceComponent,
	types: ["string"],
	options: [
		{
			field: "placeholder",
			name: "Placeholder",
			meta: {
				width: "full",
				interface: "text-input",
				schema: {
					default_value: "Enter image URL"
				}
			}
		}
	]
};

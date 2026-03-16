/** @odoo-module **/

const style = document.createElement('style');
style.textContent = `
    .o_action_manager {
        overflow: auto !important;
    }
    
    .o_content {
        overflow: auto !important;
    }
    
    .awesome_clicker_container {
        min-height: 100vh;
        overflow-y: auto;
    }
`;
document.head.appendChild(style);

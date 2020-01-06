import frappe

@frappe.whitelist(allow_guest=True)
def create_member_application(data):
    return data

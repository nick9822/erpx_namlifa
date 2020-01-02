import frappe
import json

def get_context(context):
    if frappe.session.user != 'Guest':
        frappe.local.flags.redirect_location = '/member'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.user_doc = frappe.session
    context.csrf_token = frappe.sessions.get_csrf_token()

    return context
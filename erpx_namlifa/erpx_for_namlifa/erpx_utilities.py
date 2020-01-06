import frappe, json, base64, os, copy, re
from frappe.utils.data import formatdate

@frappe.whitelist(allow_guest=True)
def create_member_application():
    date_attrs = ["date_of_birth", "date_contracted_as_agent"]
    file_attrs = ['photo', 'signature']
    files = []
    data = json.loads(frappe.local.form_dict.data)

    for e in date_attrs:
        if data[e]:
            data[e] = formatdate(data[e], "yyyy-mm-dd")

    for e in file_attrs:
        if data[e]:
            files.append((e, data[e]))
            del data[e]

    frappe.local.response.update({ "data": frappe.get_doc(data).insert().as_dict()})
    doc = frappe.get_doc("Member Registration", frappe.local.response.data.name)

    if files:
        for f in files:
            fieldname, filedata = f
            filerem, filedata = filedata.split(',', 1)
            ext = filerem.split(';')[0].split('/')[1]
            filedata = filedata.encode()
            filename = "{0}-{1}.{2}".format(doc.name, fieldname, ext)
            fileurl = os.path.abspath(frappe.local.site_path)+"/public/files/"+filename
            
            fh = open(fileurl, "wb")
            fh.write(filedata.decode('base64'))
            fh.close()

            _file = frappe.get_doc({
                "doctype": "File",
                "file_name": filename,
                "attached_to_doctype": doc.doctype,
                "attached_to_name": doc.name,
                "file_url": "/files/"+filename
                })
            _file.save()

            # update values
            doc.set(fieldname, _file.file_url)
            doc.save()

    frappe.db.commit()
# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in erpx_namlifa/__init__.py
from erpx_namlifa import __version__ as version

setup(
	name='erpx_namlifa',
	version=version,
	description='Human Resource Module for Namlifa powered by ERPX',
	author='ERPX',
	author_email='dev.erpx@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)

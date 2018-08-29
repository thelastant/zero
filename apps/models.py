# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class CommonArticle(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    author = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    good = models.IntegerField(blank=True, null=True)
    collection = models.IntegerField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    remark = models.TextField(blank=True, null=True)
    image_id = models.IntegerField(blank=True, null=True)
    bed = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'common_article'


class CommonComment(models.Model):
    r_id = models.IntegerField(blank=True, null=True)
    p_id = models.IntegerField(blank=True, null=True)
    u_id = models.IntegerField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    good = models.IntegerField(blank=True, null=True)
    bed = models.IntegerField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    remark = models.CharField(max_length=255, blank=True, null=True)
    image_id = models.IntegerField(blank=True, null=True)
    push = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'common_comment'


class CommonPicture(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    uid = models.IntegerField(blank=True, null=True)
    rid = models.IntegerField(blank=True, null=True)
    image_type = models.IntegerField(blank=True, null=True)
    good = models.IntegerField(blank=True, null=True)
    bed = models.IntegerField(blank=True, null=True)
    remark = models.CharField(max_length=255, blank=True, null=True)
    hot = models.IntegerField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'common_picture'


class CommonUser(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    like = models.CharField(max_length=255, blank=True, null=True)
    account = models.CharField(max_length=255, blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    movie_id = models.IntegerField(blank=True, null=True)
    picture_id = models.IntegerField(blank=True, null=True)
    article_id = models.IntegerField(blank=True, null=True)
    comment_id = models.IntegerField(blank=True, null=True)
    sex = models.IntegerField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    autograph = models.IntegerField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'common_user'


class CommotMovie(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    brief = models.CharField(max_length=240, blank=True, null=True)
    hot = models.CharField(max_length=255, blank=True, null=True)
    score = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    remark = models.CharField(max_length=255, blank=True, null=True)
    author = models.CharField(max_length=255, blank=True, null=True)
    performer = models.CharField(max_length=255, blank=True, null=True)
    director = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'commot_movie'
